import React from 'react'
import UI from './components/UI.jsx'
import { createRoot } from 'react-dom/client'
import '../../scss/custom.scss'
import './style/main.css'
import { getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const root = createRoot(document.getElementById('root'))

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    console.log('Send time: ' + new Date())
    window.TRBack.loadComplete()
  }
}

root.render(<UI></UI>)
