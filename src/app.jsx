import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import ControlPanel from './components/ControlPanel.jsx'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import * as reactBootstrap from 'react-bootstrap'
import '../src/style/index.css'

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

{
  /* 
<Nav className="navbar navbar-light bg-light">
  <a className="navbar-brand">Trendiver</a>
  <form className="form-inline" id="UserSearch">
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text" id="atprepend">
          @
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder="Username"
        aria-label="Username"
        aria-describedby="atprepend"
      />
    </div>
    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
      Search User
    </button>
  </form>
  <form className="form-inline" id="TagSearch">
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text" id="hashprepend">
          #
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder="Hashtag"
        aria-label="Hashtah"
        aria-describedby="hashprepend"
      />
    </div>
    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
      Search Tag
    </button>
  </form>
</Nav> 
*/
}

root.render(
  <>
    <reactBootstrap.Navbar bg="dark">
      <reactBootstrap.Container>
        <reactBootstrap.Navbar.Brand href="#">
          Trendiver
        </reactBootstrap.Navbar.Brand>
      </reactBootstrap.Container>
    </reactBootstrap.Navbar>
    <ControlPanel DB={DB} />
  </>,
)
