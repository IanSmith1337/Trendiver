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

const FBapp = initializeApp(firebaseConfig)
const DB = getFirestore(FBapp)
const listRoot = document.createElement('ol')
const idNode = document.createAttribute('id')
idNode.value = 'tweetList'
var executing = false
var currentL = 1
var q

function setLength(l) {
  // Time controls for document retreival.
  // 1 = 5 minutes
  // 3 = 15 minutes
  // 6 = 30 minutes
  // 12 = 1 hour
  // 36 = 3 hours
  // 72 = 6 hours
  // 144 = 12 hours
  // 288 = 1 day
  q = new query(collection(DB, 'cycles'), orderBy('Time', 'desc'), limit(l))
}

async function callDB() {
  var originalMap = new Map()
  if (!executing) {
    executing = true
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc) => {
        const CDdata = doc.data()
        for (const entity in CDdata) {
          if (Object.hasOwnProperty.call(CDdata, entity)) {
            const element = CDdata[entity]
            if (entity !== 'Time') {
              if (originalMap.has(entity)) {
                originalMap.set(entity, originalMap.get(entity) + element)
              } else {
                originalMap.set(entity, element)
              }
            }
          }
        }
      })
      console.log('Finished gathering data.')
      const sorted = createSortedMap(originalMap)
      console.log('Map created.')
      updateList(sorted)
    }
    executing = false
  }
}

function createSortedMap(starting) {
  console.log('Creating map.')
  return new Map([...starting.entries()].sort((a, b) => b[1] - a[1]))
}

function updateList(sortedEntities) {
  console.log('Cleaning list...')
  if (document.getElementById('tweetList') != null) {
    document.getElementById('tweetList').remove()
    while (listRoot.firstChild) {
      listRoot.removeChild(listRoot.firstChild)
    }
    document.body.appendChild(listRoot)
    listRoot.attributes.setNamedItem(idNode)
  } else {
    document.body.appendChild(listRoot)
    listRoot.attributes.setNamedItem(idNode)
  }
  console.log('Filling...')
  var count = 0
  sortedEntities.forEach((item, index) => {
    if (count < 20) {
      const numberedItem = document.createElement('li')
      const NIText = document.createTextNode(index + ': ' + item)
      listRoot.appendChild(numberedItem)
      numberedItem.appendChild(NIText)
      count++
    }
  })
}

document.getElementById('UpdateButton').onclick = function () {
  setLength(currentL)
  callDB()
  switch (currentL) {
    case 1:
      currentL = 3
      document.getElementById('UpdateButton').textContent = '5 minutes'
      break
    case 3:
      currentL = 6
      document.getElementById('UpdateButton').textContent = '15 minutes'
      break
    case 6:
      currentL = 12
      document.getElementById('UpdateButton').textContent = '30 minutes'
      break
    case 12:
      currentL = 36
      document.getElementById('UpdateButton').textContent = '1 hour'
      break
    case 36:
      currentL = 72
      document.getElementById('UpdateButton').textContent = '3 hours'
      break
    case 72:
      currentL = 144
      document.getElementById('UpdateButton').textContent = '6 hours'
      break
    case 144:
      currentL = 288
      document.getElementById('UpdateButton').textContent = '12 hours'
      break
    case 288:
      currentL = 1
      document.getElementById('UpdateButton').textContent = '24 hours'
      break
    default:
      currentL = 1
      break
  }
}

console.log('Renderer loaded.')
