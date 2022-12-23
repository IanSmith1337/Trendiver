import React, { useEffect, useState } from 'react'
import MainUI from './components/MainUI.jsx'
import BottomStatusUI from './components/BottomStatusUI.jsx'
import { createRoot } from 'react-dom/client'
import '../../scss/custom.scss'
import './style/main.css'
import TopStatusUI from './components/TopStatusUI.jsx'
import LoadingComp from './components/LoadingComp.jsx'

const root = createRoot(document.getElementById('root'))
var first = true
window.TRBack.subscribe()

const App = () => {
  const [isLoading, setLoading] = useState(true)
  const [timeKey, setTimeKey] = useState('')
  const [update, setUpdate] = useState(0)
  const [maps, setMaps] = useState([new Map(), new Map(), new Map()])
  const [list, setList] = useState([])
  const [page, setPage] = useState(0)
  const [timer, setTimer] = useState(false)

  async function getFBData() {
    await window.TRBack.waitForReady().then(async () => {
      console.log('ready')
      await window.TRBack.getDataFromFB().then((data) => {
        window.TRBack.resetReady()
        console.log(data)
        setMaps(data[0])
        setUpdate(data[1])
        setTimeKey(data[2])
        setPage(1)
      })
    })
  }

  useEffect(() => {
    if (!first) {
      console.log('Page update call')
      console.log('Updating list.')
      updateList()
      setLoading(false)
    }
  }, [page, timeKey])

  useEffect(() => {
    if (!first) {
      console.log('Timer call')
      setLoading(true)
      getFBData()
    }
  }, [timer])

  useEffect(() => {
    console.log('1st load call')
    setLoading(true)
    getFBData()
    console.log('Updating list.')
    updateList()
    setLoading(false)
    first = false
  }, [])

  function updateList() {
    if (maps[2].size !== null && (maps[2].size > 15 || page - 1 > 0)) {
      var listItems = []
      const startPoint = (page - 1) * 15
      const endPoint =
        maps[2].size !== null && maps[2].size >= page * 15
          ? page * 15
          : maps[2].size - 1
      for (var i = startPoint; i < endPoint; i++) {
        const index = Array.from(maps[2].keys())[i]
        const item60 = maps[2].get(index)
        const item30 = maps[1].get(index)
        const item15 = maps[0].get(index)
        listItems.push(
          <tr key={index + (item60 + item30 + item15)}>
            <td>
              <p>{i + 1}</p>
            </td>
            <td>
              <p>{index}</p>
            </td>
            <td>{item15 > 0 ? <p>{item15}</p> : <p>-</p>}</td>
            <td>{item30 > 0 ? <p>{item30}</p> : <p>-</p>}</td>
            <td>
              <p>{item60}</p>
            </td>
          </tr>,
        )
      }
      console.log('List updated.')
      setList(listItems)
    } else {
      var listItems = []
      for (var i = 0; i < maps[2].size; i++) {
        const index = Array.from(maps[2].keys())[i]
        const item60 = maps[2].get(index)
        const item30 = maps[1].get(index)
        const item15 = maps[0].get(index)
        listItems.push(
          <tr key={index + (item60 + item30 + item15)}>
            <td>
              <p>{i + 1}</p>
            </td>
            <td>
              <p>{index}</p>
            </td>
            <td>{item15 > 0 ? <p>{item15}</p> : <p>-</p>}</td>
            <td>{item30 > 0 ? <p>{item30}</p> : <p>-</p>}</td>
            <td>
              <p>{item60}</p>
            </td>
          </tr>,
        )
      }
      console.log('List updated.')
      setList(listItems)
    }
  }

  return (
    <div id="UI">
      <TopStatusUI />
      <LoadingComp isLoading={isLoading}></LoadingComp>
      <MainUI
        load={isLoading}
        list={list}
        flip={setPage}
        page={page}
        maps={maps}
      />
      <BottomStatusUI
        up={update}
        load={isLoading}
        tk={timeKey}
        ST={setTimer}
        get={getFBData}
        getT={timer}
      />
    </div>
  )
}

root.render(<App />)
window.TRBack.loadComplete()
