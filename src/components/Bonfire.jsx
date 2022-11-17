import React from 'react'
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore'

class Bonfire extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeS = this.handleChangeS.bind(this)
    this.handleChangeL = this.handleChangeL.bind(this)
    this.executing = false
    this.firstTime = true
    this.unsubscribe = null
    this.listItems = null
    this.state = {
      oMap: new Map(),
      currentPage: 0,
    }
  }

  handleChangeL(event) {
    this.props.onLenChange(event.target.value / 1)
  }

  handleChangeS(event) {
    this.props.onSpanChange(event.target.value / 5)
  }

  componentDidMount() {
    if (!this.executing) {
      this.executing = true
      console.log('Mounting listener...')
      const q = new query(
        collection(this.props.DB, 'cycles'),
        orderBy('Time', 'desc'),
        limit(this.props.span),
      )
      if (q !== undefined && q !== null) {
        this.unsubscribe = onSnapshot(q, (snap) => {
          var map = new Map()
          if (!this.firstTime) {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added') {
                console.log('Add: ' + change.doc.id)
              }
              if (change.type === 'removed') {
                console.log('Remove: ' + change.doc.id)
              }
            })
          } else {
            snap.docChanges().forEach((change) => {
              console.log('First run. Add: ' + change.doc.id)
            })
            this.firstTime = false
            console.log('Listener created.')
          }
          snap.forEach((doc) => {
            const currentDocData = doc.data()
            for (const entity in currentDocData) {
              if (Object.hasOwnProperty.call(currentDocData, entity)) {
                const element = currentDocData[entity]
                if (entity !== 'Time') {
                  if (this.state.oMap.has(entity)) {
                    map.set(entity, this.state.oMap.get(entity) + element)
                  } else {
                    map.set(entity, element)
                  }
                }
              }
            }
          })
          console.log('Finished gathering data.')
          this.setState({ oMap: map }, () => {
            this.setState(
              {
                oMap: new Map(
                  [...this.state.oMap.entries()].sort((a, b) => b[1] - a[1]),
                ),
              },
              () => {
                this.listItems = []
                if (
                  this.state.oMap.size > this.props.pageSize ||
                  this.state.currentPage > 1
                ) {
                  const startPoint =
                    this.state.currentPage * this.props.pageSize
                  const endPoint =
                    this.state.oMap.size >=
                    (this.state.currentPage + 1) * this.props.pageSize
                      ? (this.state.currentPage + 1) * this.props.pageSize
                      : this.state.oMap.size - 1
                  console.log(startPoint)
                  for (var i = startPoint; i < endPoint; i++) {
                    const index = Array.from(this.state.oMap.keys())[i]
                    const item = this.state.oMap.get(index)
                    this.listItems.push(
                      <li key={index}>{index + ': ' + item}</li>,
                    )
                  }
                }
              },
            )
          })
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null && this.unsubscribe !== undefined) {
      this.executing = false
      this.unsubscribe()
    }
  }

  render() {
    console.log(this.listItems)
    return <ol id="listRoot">{this.listItems}</ol>
  }
}

export default Bonfire
