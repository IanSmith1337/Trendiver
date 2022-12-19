const { contextBridge, ipcRenderer } = require('electron')
const { channels } = require('../shared/constants')

contextBridge.exposeInMainWorld('TRBack', {
  loadComplete: () => ipcRenderer.send(channels.LOAD_COMPLETE),
  subscribe: () => ipcRenderer.send(channels.SUBSCRIBE),
  getDataFromFB: () => ipcRenderer.invoke(channels.GET_FB_DATA),
  getReady: () => ipcRenderer.invoke(channels.READY),
})
