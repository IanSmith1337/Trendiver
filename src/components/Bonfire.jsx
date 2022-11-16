import React from 'react'
import { initializeApp } from 'firebase/app'
import { onSnapshot, getFirestore, Query } from 'firebase/firestore'
import Sorter from './Sorter.jsx'

class Bonfire extends React.Component {
  constructor(props) {
    super(props)
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
    this.setQuery = this.setQuery.bind(this)
    this.callDBListener = this.callDBListener.bind(this)
    this.Start = this.Start.bind(this)
    const FBapp = initializeApp(config)
    this.executing = false
    this.firstTime = true
    this.unsubscribe = null
    this.DB = getFirestore(FBapp)
  }

  Start() {
    this.callDBListener()
  }

  setQuery() {
    const q = new Query(
      collection(this.DB, 'cycles'),
      orderBy('Time', 'desc'),
      limit(this.props.span),
    )
    this.props.setQ(q)
  }

  callDBListener() {
    if (!this.executing) {
      this.executing = true
      console.log('Attaching listener...')
      this.unsubscribe = onSnapshot(this.props.query, (qs) => {
        this.setState({ oMap: new Map(), aMap: new Map(), sMap: new Map() })
        if (!this.firstTime) {
          qs.docChanges().forEach((change) => {
            if (change.type === 'added') {
              console.log('Add: ' + change.doc.id)
            }
            if (change.type === 'removed') {
              console.log('Remove: ' + change.doc.id)
            }
          })
        } else {
          qs.docChanges().forEach((change) => {
            console.log('First run. Add: ' + change.doc.id)
          })
          this.firstTime = false
          console.log('Listener created.')
        }
        qs.forEach((doc) => {
          const currentDocData = doc.data()
          for (const entity in currentDocData) {
            if (Object.hasOwnProperty.call(currentDocData, entity)) {
              const element = currentDocData[entity]
              if (entity !== 'Time') {
                if (this.props.oMap.has(entity)) {
                  this.props.oMap.set(
                    entity,
                    this.props.oMap.get(entity) + element,
                  )
                } else {
                  this.props.oMap.set(entity, element)
                }
              }
            }
          }
        })
        console.log('Finished gathering data.')
        console.log('Map created.')
        this.setState({ oMap: Sorter(this.props.oMap) })
      })
    } else {
      if (
        typeof this.unsubscribe !== 'undefined' &&
        this.unsubscribe !== null
      ) {
        this.unsubscribe()
      }
      this.setState({ currentPage: 0 })
      this.executing = false
      this.firstTime = true
      console.log('Unsubscribed and reset')
      this.callDBListener()
    }
  }

  UpdateList(props) {
    const listItems = props.o.forEach((item) => (
      <li key={item.toString()}>{item}</li>
    ))
    return <ol>{listItems}</ol>
  }

  render() {
    const oMap = this.props.oMap
    return (
      <div id="listRoot">
        <this.UpdateList o={oMap} />
      </div>
    )
  }
}

export default Bonfire
