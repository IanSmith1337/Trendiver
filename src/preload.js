const { contextBridge, ipcRenderer } = require('electron')
const { channels } = require('./shared/constants')

contextBridge.exposeInMainWorld('TRBack', {
  sendHelloMessage: (message) =>
    ipcRenderer.invoke(channels.HELLO_EVENT, message),
})
