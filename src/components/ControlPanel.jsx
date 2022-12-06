import React from 'react'
import ControlPanelSpan from './ControlPanelSpan.jsx'
import ControlPanelPageSize from './ControlPanelPageSize.jsx'
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore'
import Loading from './Loading.jsx'
import { Button, Pagination, Stack, Modal, Table } from 'react-bootstrap'
import Countdown from 'react-countdown'

var stop = null

class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
    this.handlePSChange = this.handlePSChange.bind(this)
    this.handleSpanChange = this.handleSpanChange.bind(this)
    this.handleCurrentPageChange = this.handleCurrentPageChange.bind(this)
    this.updateList = this.updateList.bind(this)
    this.updateQuery = this.handleQueryUpdate.bind(this)
    this.Subscribe = this.Subscribe.bind(this)
    this.handleLoadToggle = this.handleLoadToggle.bind(this)
    this.firstTime = true
    this.update = 0
    this.state = {
      span: 1,
      map: new Map(),
      pageSize: 25,
      currentPage: 1,
      query: undefined,
      list: [],
      isLoading: true,
    }
    this.loadRef = React.createRef()
    this.key = this.update
  }

  componentDidMount() {
    window.addEventListener('load', this.handleQueryUpdate())
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleQueryUpdate())
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
        console.log('Update found, reloading list...')
      } else {
        console.log('First run.')
        snap.docChanges().forEach((change) => {
          console.log('Add: ' + change.doc.id)
        })
        this.firstTime = false
        console.log('Listener created.')
      }
      this.state.map.clear()
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
            } else {
              if (element * 1000 + 305000 >= this.update) {
                this.update = new Date(element * 1000 + 305000)
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
            if (this.state.isLoading) {
              const node = this.loadRef.current
              node.toggle()
              this.key = this.update / 1000
            }
          })
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
          this.firstTime = true
          console.log('Listener stopped.')
        }
        console.log('Mounting new listener...')
        this.Subscribe()
      },
    )
  }

  updateList() {
    if (
      this.state.map.size !== null &&
      (this.state.map.size > this.state.pageSize ||
        this.state.currentPage - 1 > 0)
    ) {
      var listItems = []
      const startPoint = (this.state.currentPage - 1) * this.state.pageSize
      const endPoint =
        this.state.map.size !== null &&
        this.state.map.size >= this.state.currentPage * this.state.pageSize
          ? this.state.currentPage * this.state.pageSize
          : this.state.map.size - 1
      for (var i = startPoint; i < endPoint; i++) {
        const index = Array.from(this.state.map.keys())[i]
        const item = this.state.map.get(index)
        listItems.push(
          <tr key={index + item}>
            <td>
              <p>{i + 1}</p>
            </td>
            <td>
              <p>{index}</p>
            </td>
            <td>
              <p>{item}</p>
            </td>
            <td></td>
          </tr>,
        )
      }
      this.list = listItems
      console.log('List updated.')
      return listItems
    } else {
      var listItems = []
      for (var i = 0; i < this.state.map.size; i++) {
        const index = Array.from(this.state.map.keys())[i]
        const item = this.state.map.get(index)
        listItems.push(
          <tr>
            <td>
              <p>{i + 1}</p>
            </td>
            <td>
              <p>{index}</p>
            </td>
            <td>
              <p>{item}</p>
            </td>
            <td></td>
          </tr>,
        )
      }
      this.list = listItems
      console.log('List updated.')
      return listItems
    }
  }

  handleCurrentPageChange(current) {
    const node = this.loadRef.current
    this.setState({ currentPage: current }, () => {
      node.toggle()
      this.setState({ list: this.updateList() }, () => {
        node.toggle()
      })
    })
  }

  handlePSChange(Page) {
    const node = this.loadRef.current
    this.setState({ pageSize: Page }, () => {
      node.toggle()
      this.setState({ list: this.updateList() }, () => {
        node.toggle()
      })
    })
  }

  handleSpanChange(Span) {
    this.setState({ span: Span }, () => {
      const node = this.loadRef.current
      node.toggle()
      console.log('Updating query...')
      this.handleQueryUpdate()
    })
  }

  render() {
    const span = this.state.span
    const pageSize = this.state.pageSize
    const load = this.state.isLoading
    return (
      <div id="ControlPanel" className="position-relative">
        <Loading
          ref={this.loadRef}
          isLoading={load}
          toggle={this.handleLoadToggle}
        ></Loading>
        <div
          id="ControlPanelUpper"
          style={{
            display: !this.state.isLoading ? 'block' : 'none',
          }}
        >
          <ControlPanelSpan span={span} onSpanChange={this.handleSpanChange} />
          <ControlPanelPageSize
            pageSize={pageSize}
            onLenChange={this.handlePSChange}
          />
        </div>
        <div
          id="timer"
          style={{
            display: !this.state.isLoading ? 'block' : 'none',
          }}
        >
          {this.update > 0 && (
            <Countdown
              date={this.update}
              key={this.key}
              onComplete={() => {
                if (!this.state.isLoading) {
                  this.loadRef.current.toggle()
                }
              }}
            />
          )}
        </div>
        <div
          id="ControlPanelCenter"
          style={{
            display: !this.state.isLoading ? 'block' : 'none',
          }}
        >
          <table id="dataRoot">
            <thead>
              <tr>
                <th id="rankHead">
                  <div>
                    <p>Rank</p>
                  </div>
                </th>
                <th id="itemHead">
                  <div>
                    <p>Item</p>
                  </div>
                </th>
                <th id="hitsHead">
                  <div>
                    <p>Hits</p>
                  </div>
                </th>
                <th id="chartHead">
                  <div>
                    <p>Chart</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>{this.state.list}</tbody>
          </table>
        </div>
        <Pagination
          id="pagination"
          style={{
            display: !this.state.isLoading ? 'block' : 'none',
          }}
        >
          {this.state.currentPage > 1 && (
            <Pagination.First
              onClick={() => {
                this.handleCurrentPageChange(1)
              }}
            />
          )}
          {this.state.currentPage - 1 >= 1 && (
            <Pagination.Prev
              onClick={() => {
                const m1 = this.state.currentPage - 1
                this.handleCurrentPageChange(m1)
              }}
            />
          )}
          {this.state.currentPage - 2 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m2 = this.state.currentPage - 2
                this.handleCurrentPageChange(m2)
              }}
            >
              {this.state.currentPage - 2}
            </Pagination.Item>
          )}
          {this.state.currentPage - 1 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m1 = this.state.currentPage - 1
                this.handleCurrentPageChange(m1)
              }}
            >
              {this.state.currentPage - 1}
            </Pagination.Item>
          )}
          {this.list !== undefined && (
            <Pagination.Item disabled>
              Current Page: {this.state.currentPage}
            </Pagination.Item>
          )}
          {this.state.currentPage + 1 <=
            (this.state.map.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p1 = this.state.currentPage + 1
                this.handleCurrentPageChange(p1)
              }}
            >
              {this.state.currentPage + 1}
            </Pagination.Item>
          )}
          {this.state.currentPage + 2 <=
            (this.state.map.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p2 = this.state.currentPage + 2
                this.handleCurrentPageChange(p2)
              }}
            >
              {this.state.currentPage + 2}
            </Pagination.Item>
          )}
          {this.state.currentPage + 1 <=
            (this.state.map.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Next
              onClick={() => {
                const n = this.state.currentPage + 1
                this.handleCurrentPageChange(n)
              }}
            />
          )}
          {this.state.currentPage <
            (this.state.map.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Last
              onClick={() => {
                const end = (this.state.map.size / this.state.pageSize).toFixed(
                  0,
                )
                this.handleCurrentPageChange(end)
              }}
            />
          )}
        </Pagination>
      </div>
    )
  }
}

export default ControlPanel
