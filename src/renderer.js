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

console.log('Renderer loaded.')

var lastID = ''
var executing = false

const listRoot = document.getElementById('tweetList')

async function getLatestInfo() {
  var originalMap = new Map()
  if (!executing) {
    executing = true
    const q = new query(
      collection(DB, 'cycles'),
      orderBy('Time', 'desc'),
      limit(1),
    )
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length > 0) {
      console.log('New doc?: ' + (lastID !== querySnapshot.docs[0].id))
      if (lastID !== querySnapshot.docs[0].id) {
        const docData = querySnapshot.docs[0].data()
        for (const entity in docData) {
          if (Object.hasOwnProperty.call(docData, entity)) {
            const element = docData[entity]
            if (entity !== 'Time') {
              originalMap.set(entity, element)
            }
          }
        }
        const sorted = createSortedMap(originalMap)
        console.log('Map created.')
        console.log(sorted)
        updateList(sorted)
        lastID = querySnapshot.docs[0].id
      }
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
  if (listRoot.hasChildNodes) {
    listRoot.childNodes.forEach((e) => {
      e.remove()
    })
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

document.getElementById('UpdateButton').onclick = getLatestInfo
setInterval(getLatestInfo, 300000)
