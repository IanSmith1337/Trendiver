import { initializeApp } from 'firebase/app'

import { collection, getDocs, getFirestore } from 'firebase/firestore'

import { contextBridge } from 'electron'



// Initialize Firebase

const FBapp = initializeApp(firebaseConfig)

contextBridge.exposeInMainWorld('Firebase', {
  app: () => {
    return FBapp
  },
  aString: () => {
    return 'this is a string'
  },
})
