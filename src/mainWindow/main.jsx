import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import MainUI from './components/MainUI.jsx'
import BottomStatusUI from './components/BottomStatusUI.jsx'
import { createRoot } from 'react-dom/client'
import '../../scss/custom.scss'
import './style/main.css'
import TopStatusUI from './components/TopStatusUI.jsx'

const root = createRoot(document.getElementById('root'))
var first = true

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    console.log('Send time: ' + new Date())
    window.TRBack.subscribe()
    window.TRBack.loadComplete()
  }
}

const App = () => {
  const [isLoading, setLoading] = useState(true)
  const [timeKey, setTimeKey] = useState('')
  const [update, setUpdate] = useState(0)
  const [maps, setMaps] = useState([new Map(), new Map(), new Map()])
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)

  if (first) {
    getFBData()
    first = false
  }

  async function getFBData() {
    if (!isLoading) {
      setLoading(true)
    }
    var ready = false
    do {
      ready = await window.TRBack.getReady()
      await new Promise((r) => setTimeout(r, 1000))
    } while (!ready)
    const data = await window.TRBack.getDataFromFB()
    console.log(data)
    setMaps(data[0])
    setUpdate(data[1])
    setTimeKey(data[2])
    if (isLoading) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    console.log('Updating list.')
    updateList()
    setLoading(false)
  }, [update, page])

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
        get={getFBData}
      />
    </div>
  )
}

root.render(<App />)
