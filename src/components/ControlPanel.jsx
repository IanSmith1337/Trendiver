import React from 'react'
import ControlPanelSelectLength from './ControlPanelSelectLength.jsx'
import ControlPanelPageSize from './ControlPanelPageSize.jsx'
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore'
import Loading from './Loading.jsx'

var stop = null

class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.handlePSChange = this.handlePSChange.bind(this)
    this.handleSpanChange = this.handleSpanChange.bind(this)
    this.updateList = this.updateList.bind(this)
    this.updateQuery = this.handleQueryUpdate.bind(this)
    this.Subscribe = this.Subscribe.bind(this)
    this.handleLoadToggle = this.handleLoadToggle.bind(this)
    this.firstTime = true
    this.state = {
      span: 0,
      map: new Map(),
      pageSize: 25,
      currentPage: 0,
      query: undefined,
      list: [],
      isLoading: false,
    }
    this.loadRef = React.createRef()
  }

  Subscribe() {
    stop = onSnapshot(this.state.query, (snap) => {
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
        console.log('First run.')
        snap.docChanges().forEach((change) => {
          console.log('Add: ' + change.doc.id)
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
              if (this.state.map.has(entity)) {
                this.state.map.set(entity, this.state.map.get(entity) + element)
              } else {
                this.state.map.set(entity, element)
              }
            }
          }
        }
      })
      console.log('Finished gathering data.')
      this.setState(
        {
          map: new Map(
            [...this.state.map.entries()].sort((a, b) => b[1] - a[1]),
          ),
        },
        () => {
          console.log('Sorted. Updating list...')
          this.setState({ list: this.updateList() }, () => {
            console.log('List state updated.')
          })
          const node = this.loadRef.current
          node.toggle()
        },
      )
    })
  }

  handleLoadToggle(t) {
    this.setState({ isLoading: t })
  }

  handleQueryUpdate() {
    this.setState(
      {
        query: new query(
          collection(this.props.DB, 'cycles'),
          orderBy('Time', 'desc'),
          limit(this.state.span),
        ),
      },
      () => {
        console.log('Query updated')
        if (stop !== undefined && stop !== null) {
          stop()
          console.log('Listener stopped.')
        }
        console.log('Mounting new listener...')
        const node = this.loadRef.current
        node.toggle()
        this.Subscribe()
      },
    )
  }

  updateList() {
    if (
      this.state.map.size !== null &&
      (this.state.map.size > this.state.pageSize || this.state.currentPage > 1)
    ) {
      var listItems = []
      const startPoint = this.state.currentPage * this.state.pageSize
      const endPoint =
        this.state.map.size !== null &&
        this.state.map.size >=
          (this.state.currentPage + 1) * this.state.pageSize
          ? (this.state.currentPage + 1) * this.state.pageSize
          : this.state.map.size - 1
      for (var i = startPoint; i < endPoint; i++) {
        const index = Array.from(this.state.map.keys())[i]
        const item = this.state.map.get(index)
        listItems.push(<li key={index}>{index + ': ' + item}</li>)
      }
      this.list = listItems
      console.log('List updated.')
      return listItems
    } else {
      var listItems = []
      for (var i = 0; i < this.state.map.size; i++) {
        const index = Array.from(this.state.map.keys())[i]
        const item = this.state.map.get(index)
        listItems.push(<li key={index}>{index + ': ' + item}</li>)
      }
      this.list = listItems
      console.log('List updated.')
      return listItems
    }
  }

  handlePSChange(Page) {
    this.setState({ pageSize: Page }, () => {
      this.setState({ list: this.updateList() })
    })
  }

  handleSpanChange(Span) {
    this.setState({ span: Span }, () => {
      console.log('Updating query...')
      this.handleQueryUpdate()
    })
  }

  render() {
    const span = this.state.span
    const pageSize = this.state.pageSize
    const load = this.state.isLoading
    return (
      <div className="ControlPanel">
        <div className="ControlPanelUpper">
          <ControlPanelSelectLength
            span={span}
            onSpanChange={this.handleSpanChange}
          />
          <ControlPanelPageSize
            pageSize={pageSize}
            onLenChange={this.handlePSChange}
          />
        </div>
        <div className="ControlPanelCenter">
          <Loading
            ref={this.loadRef}
            isLoading={load}
            toggle={this.handleLoadToggle}
          ></Loading>
          <ol
            id="listRoot"
            style={{
              display: !this.state.isLoading ? 'block' : 'none',
            }}
          >
            {this.state.list}
          </ol>
        </div>
        <div className="ControlPanelLower"></div>
      </div>
    )
  }
}

export default ControlPanel
