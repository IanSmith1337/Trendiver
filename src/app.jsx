import React from 'react'
import ReactDOM from 'react-dom/client'
import ControlPanel from './components/ControlPanel.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
function render() {
  root.render(
    <React.StrictMode>
      <div>
        <header>
          <h1>Trendiver</h1>
        </header>
        <ControlPanel />
        <div id="listDiv"></div>
        <div id="controlPanelLower"></div>
      </div>
    </React.StrictMode>,
  )
}

function setQuery(props) {
  q = new query(
    collection(DB, 'cycles'),
    orderBy('Time', 'desc'),
    limit(dCount),
  )
}

render()
