import React from 'react'
import UI from './components/UI.jsx'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import '../../scss/custom.scss'
import './style/main.css'

const root = createRoot(document.getElementById('root'))
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
const FBapp = initializeApp(config)
const DB = getFirestore(FBapp)

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    console.log('Send time: ' + new Date())
    window.TRBack.loadComplete()
  }
}

root.render(<UI DB={DB}></UI>)
