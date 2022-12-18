const { contextBridge, ipcRenderer } = require('electron')
const { channels } = require('../shared/constants')

contextBridge.exposeInMainWorld('TRBack', {
  loadComplete: () => ipcRenderer.send(channels.LOAD_COMPLETE),
  subscribe: () => ipcRenderer.send(channels.SUBSCRIBE),
  unsubscribe: () => ipcRenderer.send(channels.UNSUBSCRIBE),
  getDataFromFB: () => ipcRenderer.invoke(channels.GET_FB_DATA),
  subscriptionWatcher: (callback) =>
    ipcRenderer.on(channels.SUBSCRIPTION_UPDATE, callback),
})
