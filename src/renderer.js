/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css'

import { initializeApp } from 'firebase/app'

import {
  collection,
  onSnapshot,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  where,
  limitToLast,
  query,
  orderBy,
  documentId,
  limit,
  FieldPath,
  exists,
  endAt,
} from 'firebase/firestore'
import { map } from '@firebase/util'

const firebaseConfig = {
  apiKey: 'AIzaSyA3gUrQZvp23tQINOnr764EMPTczPlYbUw',

  authDomain: 'trendranger.firebaseapp.com',

  databaseURL: 'https://trendranger-default-rtdb.firebaseio.com',

  projectId: 'trendranger',

  storageBucket: 'trendranger.appspot.com',

  messagingSenderId: '562626708864',

  appId: '1:562626708864:web:d39086ddc7fe8de46f2d65',

  measurementId: 'G-CRE91QKHLR',
}

// Constant Initialization:
const FBapp = initializeApp(firebaseConfig)
const DB = getFirestore(FBapp)
const listRoot = document.createElement('ol')
const idNodeList = document.createAttribute('id')
const idNodeNext = document.createAttribute('id')
const idNodePrev = document.createAttribute('id')
const nextButton = document.createElement('button')
const prevButton = document.createElement('button')
const textNB = document.createTextNode('Next')
const textPB = document.createTextNode('Previous')
const pageSizeSelector = document.getElementById('itemsToDisplay')

// Variable initialization:
var executing = false
var firstTime = true
var currentPage = 0
var pageSize
var q
var unsubscribe
var sorted

// HTML Document Setup
nextButton.appendChild(textNB)
prevButton.appendChild(textPB)
idNodeList.value = 'tweetList'
idNodeNext.value = 'nextButton'
idNodePrev.value = 'prevButton'
nextButton.attributes.setNamedItem(idNodeNext)
prevButton.attributes.setNamedItem(idNodePrev)

// Events

window.onload = function () {
  pageSize = pageSizeSelector.value
  console.log('Renderer loaded.')
}

pageSizeSelector.onchange = function () {
  pageSize = pageSizeSelector.value
  if (sorted.size > 0 && typeof sorted !== 'undefined' && sorted !== null) {
    updateList(sorted, currentPage)
  }
}

document.getElementById('UpdateButton5').onclick = function () {
  setTimeSpan(1)
  callDBListener()
}

document.getElementById('UpdateButton15').onclick = function () {
  setTimeSpan(3)
  callDBListener()
}

document.getElementById('UpdateButton30').onclick = function () {
  setTimeSpan(6)
  callDBListener()
}

document.getElementById('UpdateButton60').onclick = function () {
  setTimeSpan(12)
  callDBListener()
}

document.getElementById('UpdateButton180').onclick = function () {
  setTimeSpan(36)
  callDBListener()
}

document.getElementById('UpdateButton360').onclick = function () {
  setTimeSpan(72)
  callDBListener()
}

document.getElementById('UpdateButton720').onclick = function () {
  setTimeSpan(144)
  callDBListener()
}

document.getElementById('UpdateButton1440').onclick = function () {
  setTimeSpan(288)
  callDBListener()
}

function setTimeSpan(dCount) {
  // Time controls for document retreival.
  // 1 = 5 minutes
  // 3 = 15 minutes
  // 6 = 30 minutes
  // 12 = 1 hour
  // 36 = 3 hours
  // 72 = 6 hours
  // 144 = 12 hours
  // 288 = 1 day
  q = new query(
    collection(DB, 'cycles'),
    orderBy('Time', 'desc'),
    limit(dCount),
  )
}

async function callDBListener() {
  var originalMap = new Map()
  if (!executing) {
    executing = true
    unsubscribe = onSnapshot(q, (qs) => {
      var changeMap = new Map()
      if (!firstTime) {
        qs.docChanges().forEach((doc) => {
          if (doc.type === 'added') {
            const CDdata = doc.data()
            for (const entity in CDdata) {
              if (Object.hasOwnProperty.call(CDdata, entity)) {
                const element = CDdata[entity]
                if (entity !== 'Time') {
                  if (changeMap.has(entity)) {
                    changeMap.set(entity, changeMap.get(entity) + element)
                  } else {
                    changeMap.set(entity, element)
                  }
                }
              }
            }
          }
        })
      } else {
        console.log('Listener created.')
      }
      qs.forEach((doc) => {
        const CDdata = doc.data()
        for (const entity in CDdata) {
          if (Object.hasOwnProperty.call(CDdata, entity)) {
            const element = CDdata[entity]
            if (entity !== 'Time') {
              if (firstTime) {
                if (originalMap.has(entity)) {
                  originalMap.set(entity, originalMap.get(entity) + element)
                } else {
                  originalMap.set(entity, element)
                }
              } else {
              }
            }
          }
        }
      })
      if (firstTime) {
        firstTime = false
      }
      console.log('Finished gathering data.')
      sorted = createSortedMap(originalMap)
      console.log('Map created.')
      updateList(sorted, changeMap, 0)
      console.log('Done.')
    })
  } else {
    if (typeof unsubscribe !== 'undefined' && unsubscribe !== null) {
      unsubscribe()
    }
    currentPage = 0
    executing = false
    firstTime = true
    console.log('Unsubscribed and reset')
    callDBListener()
  }
}

function createSortedMap(starting) {
  console.log('Creating map.')
  return new Map([...starting.entries()].sort((a, b) => b[1] - a[1]))
}

function updateList(sortedEntities, changes, page) {
  console.log('Cleaning list...')
  if (document.getElementById('tweetList') != null) {
    document.getElementById('tweetList').remove()
    while (listRoot.firstChild) {
      listRoot.removeChild(listRoot.firstChild)
    }
    document.body.appendChild(listRoot)
    listRoot.attributes.setNamedItem(idNodeList)
  } else {
    document.body.appendChild(listRoot)
    listRoot.attributes.setNamedItem(idNodeList)
  }
  console.log('Filling...')
  if (sortedEntities.size > pageSize || page > 1) {
    const startPoint = page * pageSize
    const endPoint =
      sortedEntities.size >= (page + 1) * pageSize
        ? (page + 1) * pageSize
        : sortedEntities.size - 1
    for (var i = startPoint; i < endPoint; i++) {
      const index = Array.from(sortedEntities.keys())[i]
      const item = sortedEntities.get(index)
      const numberedItem = document.createElement('li')
      if (changes.get(index)) {
        const NITextChanges = document.createTextNode(
          index +
            ': ' +
            item +
            ' (' +
            (changes.get(index) > item
              ? '+' + (changes.get(index) - item)
              : '-' + (item - changes.get(index))) +
            ')',
        )
        listRoot.appendChild(numberedItem)
        numberedItem.appendChild(NITextChanges)
      } else {
        const NITextNoChange = document.createTextNode(index + ': ' + item)
        listRoot.appendChild(numberedItem)
        numberedItem.appendChild(NITextNoChange)
      }
      const numVal = document.createAttribute('value')
      numVal.value = i + 1
      numberedItem.attributes.setNamedItem(numVal)
    }
    document.body.appendChild(nextButton)
    if (page >= 1) {
      document.body.appendChild(prevButton)
      if (prevButton.getAttribute('listener') == null) {
        prevButton.addEventListener('click', function () {
          currentPage--
          updateList(sorted, currentPage)
        })
        prevButton.attributes.setNamedItem(document.createAttribute('listener'))
      }
    }
    if (nextButton.getAttribute('listener') == null) {
      nextButton.addEventListener('click', function () {
        currentPage++
        updateList(sorted, currentPage)
      })
      nextButton.attributes.setNamedItem(document.createAttribute('listener'))
    }
  } else {
    sortedEntities.forEach((item, index) => {
      const numberedItem = document.createElement('li')
      const NIText = document.createTextNode(index + ': ' + item)
      listRoot.appendChild(numberedItem)
      numberedItem.appendChild(NIText)
    })
  }
  console.log('Fill complete.')
}
