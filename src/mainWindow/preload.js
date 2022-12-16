const { contextBridge, ipcRenderer } = require('electron')
const { channels } = require('../shared/constants')

contextBridge.exposeInMainWorld('TRBack', {
  loadComplete: () => ipcRenderer.send(channels.LOAD_COMPLETE),
})
