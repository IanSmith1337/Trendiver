const { channels } = require('../src/shared/constants.js')
const { app, BrowserWindow, ipcMain } = require('electron')
const { path } = require('path')
const { fs } = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function ack(event, message) {
  console.log('Hello from the main process! You are: ' + message)
  return 'Main Process'
}

function createAndShowLoading() {
  const loader = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      preload: LOADER_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
    show: false,
    frame: false,
  })

  loader.once('show', () => {
    const main = createMain()
    main.webContents.once('dom-ready', () => {
      console.log('main loaded')
      main.show()
      loader.hide()
      loader.close()
    })
  })

  loader.loadURL(LOADER_WEBPACK_ENTRY)
  loader.show()
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  ipcMain.handle(channels.HELLO_EVENT, ack)
  return mainWindow
}

app.whenReady().then(() => {
  createAndShowLoading()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMain()
  }
})
