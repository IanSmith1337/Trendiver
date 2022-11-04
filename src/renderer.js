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

import { collection, getDocs, getFirestore } from 'firebase/firestore'

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

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack',
)

async function getCycles() {
  const querySnapshot = await getDocs(collection(DB, 'cycles'))
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data())
  })
}

getCycles()
const listRoot = document.getElementById('tweetList')
const node = document.createElement('li')
const textnode = document.createTextNode('nothing here yet...')
listRoot.appendChild(node.appendChild(textnode))
