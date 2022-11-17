import React from 'react'
import ReactDOM from 'react-dom/client'
import ControlPanel from './components/ControlPanel.jsx'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
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

function render() {
  root.render(
    <React.StrictMode>
      <div>
        <header>
          <h1>Trendiver</h1>
        </header>
        <ControlPanel DB={DB} />
      </div>
    </React.StrictMode>,
  )
}

render()
