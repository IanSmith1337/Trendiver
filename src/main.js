const { channels } = require('../src/shared/constants.js')
const { app, BrowserWindow, ipcMain } = require('electron')
const { path } = require('path')
const { fs } = require('fs')
const { initializeApp } = require('firebase/app')
const {
  getFirestore,
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} = require('firebase/firestore')

// Firebase Config
const config = {
  apiKey: 'AIzaSyCupSjMsmiWQqQRc3safixumPHi7c2MXv4',

  authDomain: 'trendranger.firebaseapp.com',

  databaseURL: 'https://trendranger-default-rtdb.firebaseio.com',

  projectId: 'trendranger',

  storageBucket: 'trendranger.appspot.com',

  messagingSenderId: '562626708864',

  appId: '1:562626708864:web:d39086ddc7fe8de46f2d65',

  measurementId: 'G-CRE91QKHLR',
}

const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp)

// BrowserWindow Globals
let main = null
let mainWindow = null

// DB constants
const queries = [
  new query(collection(db, 'cycles'), orderBy('Time', 'desc'), limit(3)),
  new query(collection(db, 'cycles'), orderBy('Time', 'desc'), limit(6)),
  new query(collection(db, 'cycles'), orderBy('Time', 'desc'), limit(12)),
]
const maps = [new Map(), new Map(), new Map()]

// DB Variables
var sorting = 60
var stop15 = null
var stop30 = null
var stop60 = null
var firstRun = true
var timeKey = 0
var time = new Date()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function ack(m, l) {
  console.log("Rec'd time: " + new Date())
  m.maximize()
  l.hide()
  l.close()
}

function createSubs() {
  if (stop60 === null && stop30 === null && stop15 === null) {
    console.log('No dupes detected.')
    stop60 = onSnapshot(queries[2], (snap) => {
      if (!firstRun) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(60 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(60 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('(60 Min) Update found, reloading list...')
      } else {
        console.log('First run.')
        snap.docChanges().forEach((change) => {
          console.log('(60 Min) Add: ' + change.doc.id)
        })
        firstRun = false
        console.log('(60 Min) Listener created.')
      }
      maps[2].clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (maps[2].has(entity)) {
                maps[2] = maps[2].set(entity, maps[2].get(entity) + element)
              } else {
                maps[2] = maps[2].set(entity, element)
              }
            } else {
              if (element * 1000 + 305000 >= time) {
                time = new Date(element * 1000 + 305000)
              }
            }
          }
        }
      })
      console.log('(60 Min) Finished gathering 60 min data.')
      if (sorting == 60) {
        maps[2] = new Map([...maps[2].entries()].sort((a, b) => b[1] - a[1]))
        console.log('(60 Min) Sorted.')
        timeKey = time / 1000
      }
    })
    stop30 = onSnapshot(queries[1], (snap) => {
      if (!firstRun) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(30 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(30 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('(30 Min) Update found, reloading list...')
      } else {
        console.log('(30 Min) First run.')
        snap.docChanges().forEach((change) => {
          console.log('(30 Min) Add: ' + change.doc.id)
        })
        firstRun = false
        console.log('(30 Min) Listener created.')
      }
      maps[1].clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (maps[2].has(entity)) {
                if (maps[1].has(entity)) {
                  maps[1] = maps[1].set(entity, maps[1].get(entity) + element)
                } else {
                  maps[1] = maps[1].set(entity, element)
                }
              }
            } else {
              if (element * 1000 + 305000 >= time) {
                time = new Date(element * 1000 + 305000)
              }
            }
          }
        }
      })
      console.log('(30 Min) Finished gathering 30 min data.')
      if (sorting == 30) {
        maps[1] = new Map([...maps[1].entries()].sort((a, b) => b[1] - a[1]))
        console.log('(30 Min) Sorted.')
        timeKey = time / 1000
      }
    })
    stop15 = onSnapshot(queries[0], (snap) => {
      if (!firstRun) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(15 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(15 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('(15 Min) Update found, reloading list...')
      } else {
        console.log('(15 Min) First run.')
        snap.docChanges().forEach((change) => {
          console.log('(15 Min) Add: ' + change.doc.id)
        })
        firstRun = false
        console.log('(15 Min) Listener created.')
      }
      maps[0].clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (maps[2].has(entity)) {
                if (maps[1].has(entity)) {
                  if (maps[0].has(entity)) {
                    maps[0] = maps[0].set(entity, maps[0].get(entity) + element)
                  } else {
                    maps[0] = maps[0].set(entity, element)
                  }
                }
              }
            } else {
              if (element * 1000 + 305000 >= time) {
                time = new Date(element * 1000 + 305000)
              }
            }
          }
        }
      })
      console.log('(15 Min) Finished gathering 15 min data.')
      if (sorting == 15) {
        maps[0] = new Map([...maps[0].entries()].sort((a, b) => b[1] - a[1]))
        console.log('(15 Min) Sorted.')
        timeKey = time / 1000
      }
      mainWindow.webContents.send(channels.SUBSCRIPTION_UPDATE)
    })
  } else {
    console.log('Dupes found, not creating.')
    mainWindow.webContents.send(channels.SUBSCRIPTION_UPDATE)
  }
}

function removeSubs() {
  if (stop60 !== null || stop30 !== null || stop15 !== null) {
    stop60()
    stop30()
    stop15()
  }
}

function getMapsTimeAndKey() {
  return [maps, time, timeKey]
}

function createAndShowLoading() {
  const loader = new BrowserWindow({
    width: 400,
    height: 300,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    frame: false,
  })

  loader.loadURL(LOADER_WEBPACK_ENTRY)
  loader.webContents.once('dom-ready', () => {
    loader.show()
    ipcMain.once(channels.LOAD_COMPLETE, () => {
      ack(main, loader)
    })
    main = createMain()
  })
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    titleBarStyle: 'hidden',
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  console.log('cleaning listeners')

  ipcMain.removeAllListeners(channels.SUBSCRIBE)
  ipcMain.removeAllListeners(channels.GET_FB_DATA)
  mainWindow.removeAllListeners('close')

  ipcMain.on(channels.SUBSCRIBE, () => {
    console.log('Attaching subscriptions')
    createSubs()
  })

  mainWindow.on('close', () => {
    console.log('removing subscriptions.')
    removeSubs()
  })

  ipcMain.handle(channels.GET_FB_DATA, () => {
    console.log('getting data...')
    return getMapsTimeAndKey()
  })

  return mainWindow
}

app.whenReady().then(() => {
  createAndShowLoading()
})

app.on('window-all-closed', () => {
  removeSubs()
  app.quit()
})

app.on('render-process-gone', (event, webContents, details) => {
  removeSubs()
  console.error('The app crashed. Reason: ' + details.reason)
  app.exit(details.exitCode)
})
