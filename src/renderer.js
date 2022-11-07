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
} from 'firebase/firestore'

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

const listRoot = document.getElementById('tweetList')
var originalMap = new Map()
var sortedMap = new Map()

document.getElementById('UpdateButton').onclick = async function () {
  const q = new query(
    collection(DB, 'cycles'),
    where('Time', '>=', Date.now() / 1000),
    limit(1),
  )
  const querySnapshot = await getDocs(q)
  console.log(querySnapshot.docs[0].id)
  const docData = querySnapshot.docs[0].data()
  console.log(docData)
  for (const entity in docData) {
    if (Object.hasOwnProperty.call(docData, entity)) {
      const element = docData[entity]
      console.log(docData.entity + ': ' + element)
    }
  }
}

const q = new Query(collection(DB, 'cycles'))
/*const listener = onSnapshot(q, (snapshot) => {
  if (snapshot.docChanges().length == 1) {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        for (let i = 0; i < change.doc.data().length; i++) {
          console.log(change.doc.data()[i])
        }
      }
    })
  }
})*/
