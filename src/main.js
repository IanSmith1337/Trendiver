const { channels } = require('../src/shared/constants.js')
const { app, BrowserWindow, ipcMain } = require('electron')
const { path } = require('path')
const { fs } = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main = null
let BG = null
let mainWindow = null
let secondaryWindow = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function ack(m, l) {
  console.log("Rec'd time: " + new Date())
  m.show()
  l.hide()
  l.close()
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
      if (BG === null) {
        createBG()
      }
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
    show: false,
    titleBarStyle: 'hidden',
  })

  mainWindow.maximize()
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  return mainWindow
}

function createSecondary() {
  secondaryWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    titleBarStyle: 'hidden',
  })

  secondaryWindow.maximize()
  secondaryWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

function createBG() {
  BG = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      preload: BG_PRELOAD_WEBPACK_ENTRY,
    },
    show: false,
  })

  BG.excludedFromShownWindowsMenu = true
  BG.loadURL(BG_WEBPACK_ENTRY)
}

app.whenReady().then(() => {
  createAndShowLoading()

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log(BrowserWindow.getAllWindows().length)
    if (BrowserWindow.getAllWindows().length === 1) {
      createSecondary()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
