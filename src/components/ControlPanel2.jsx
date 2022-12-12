import React from 'react'
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

var stop15 = null
var stop30 = null
var stop60 = null

class ControlPanel2 extends React.Component {
  constructor(props) {
    super(props)
    this.handlePSChange = this.handlePSChange.bind(this)
    this.handlePageFlip = this.handlePageFlip.bind(this)
    this.updateList = this.updateList.bind(this)
    this.Subscribe = this.Subscribe.bind(this)
    this.handleLoadToggle = this.handleLoadToggle.bind(this)
    this.firstTime = true
    this.update = 0
    this.state = {
      map15: new Map(),
      map30: new Map(),
      map60: new Map(),
      pageSize: 25,
      currentPage: 1,
      query: undefined,
      list: [],
      isLoading: true,
      sorting: 60,
    }
    this.loadRef = React.createRef()
    this.key = this.update
    this.q1 = new query(
      collection(this.props.DB, 'cycles'),
      orderBy('Time', 'desc'),
      limit(3),
    )
    this.q2 = new query(
      collection(this.props.DB, 'cycles'),
      orderBy('Time', 'desc'),
      limit(6),
    )
    this.q3 = new query(
      collection(this.props.DB, 'cycles'),
      orderBy('Time', 'desc'),
      limit(12),
    )
  }

  componentDidMount() {
    if (stop60 !== null || stop30 !== null || stop15 !== null) {
      stop60()
      stop30()
      stop15()
    }
    window.addEventListener('load', this.Subscribe())
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.Subscribe())
  }

  Subscribe() {
    stop60 = onSnapshot(this.q3, (snap) => {
      if (!this.firstTime) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(60 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(60 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('Update found, reloading list...')
      } else {
        console.log('First run.')
        snap.docChanges().forEach((change) => {
          console.log('(60 Min) Add: ' + change.doc.id)
        })
        this.firstTime = false
        console.log('(60 Min) Listener created.')
      }
      this.state.map60.clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (this.state.map60.has(entity)) {
                this.state.map60.set(
                  entity,
                  this.state.map60.get(entity) + element,
                )
              } else {
                this.state.map60.set(entity, element)
              }
            }
          }
        }
      })
      console.log('(60 Min) Finished gathering 60 min data.')
      if (this.state.sorting == 60) {
        this.setState(
          {
            map60: new Map(
              [...this.state.map60.entries()].sort((a, b) => b[1] - a[1]),
            ),
          },
          () => {
            console.log('(60 Min) Sorted. Updating list...')
            this.setState({ list: this.updateList() }, () => {
              console.log('(60 Min) List state updated.')
              if (this.state.isLoading) {
                const node = this.loadRef.current
                node.toggle()
                this.key = this.update / 1000
              }
            })
          },
        )
      }
    })
    stop30 = onSnapshot(this.q2, (snap) => {
      if (!this.firstTime) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(30 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(30 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('(30 Min) Update found, reloading list...')
      } else {
        console.log('(30 Min) First run.')
        snap.docChanges().forEach((change) => {
          console.log('(30 Min) Add: ' + change.doc.id)
        })
        this.firstTime = false
        console.log('(30 Min) Listener created.')
      }
      this.state.map30.clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (this.state.map60.has(entity)) {
                if (this.state.map30.has(entity)) {
                  this.state.map30.set(
                    entity,
                    this.state.map30.get(entity) + element,
                  )
                } else {
                  this.state.map30.set(entity, element)
                }
              } else {
                this.state.map30.set(entity, 0)
              }
            }
          }
        }
      })
      console.log('(30 Min) Finished gathering 30 min data.')
      if (this.state.sorting == 30) {
        this.setState(
          {
            map30: new Map(
              [...this.state.map30.entries()].sort((a, b) => b[1] - a[1]),
            ),
          },
          () => {
            console.log('(30 Min) Sorted. Updating list...')
            this.setState({ list: this.updateList() }, () => {
              console.log('(30 Min) List state updated.')
              if (this.state.isLoading) {
                const node = this.loadRef.current
                node.toggle()
                this.key = this.update / 1000
              }
            })
          },
        )
      }
    })
    stop15 = onSnapshot(this.q1, (snap) => {
      if (!this.firstTime) {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('(15 Min) Add: ' + change.doc.id)
          }
          if (change.type === 'removed') {
            console.log('(15 Min) Remove: ' + change.doc.id)
          }
        })
        console.log('(15 Min) Update found, reloading list...')
      } else {
        console.log('(15 Min) First run.')
        snap.docChanges().forEach((change) => {
          console.log('(15 Min) Add: ' + change.doc.id)
        })
        this.firstTime = false
        console.log('(15 Min) Listener created.')
      }
      this.state.map15.clear()
      snap.forEach((doc) => {
        const currentDocData = doc.data()
        for (const entity in currentDocData) {
          if (Object.hasOwnProperty.call(currentDocData, entity)) {
            const element = currentDocData[entity]
            if (entity !== 'Time') {
              if (this.state.map60.has(entity)) {
                if (this.state.map30.has(entity)) {
                  if (this.state.map15.has(entity)) {
                    this.state.map15.set(
                      entity,
                      this.state.map15.get(entity) + element,
                    )
                  } else {
                    this.state.map15.set(entity, element)
                  }
                } else {
                  this.state.map15.set(entity, 0)
                }
              } else {
                this.state.map15.set(entity, 0)
              }
            } else {
              if (element * 1000 + 305000 >= this.update) {
                this.update = new Date(element * 1000 + 305000)
              }
            }
          }
        }
      })
      console.log('(15 Min) Finished gathering 15 min data.')
      if (this.state.sorting == 15) {
        this.setState(
          {
            map15: new Map(
              [...this.state.map15.entries()].sort((a, b) => b[1] - a[1]),
            ),
          },
          () => {
            console.log('(15 Min) Sorted. Updating list...')
            this.setState({ list: this.updateList() }, () => {
              console.log('(15 Min) List state updated.')
              if (this.state.isLoading) {
                const node = this.loadRef.current
                node.toggle()
                this.key = this.update / 1000
              }
            })
          },
        )
      }
    })
  }

  handleLoadToggle(t) {
    this.setState({ isLoading: t })
  }

  updateList() {
    if (
      this.state.map60.size !== null &&
      (this.state.map60.size > this.state.pageSize ||
        this.state.currentPage - 1 > 0)
    ) {
      var listItems = []
      const startPoint = (this.state.currentPage - 1) * this.state.pageSize
      const endPoint =
        this.state.map60.size !== null &&
        this.state.map60.size >= this.state.currentPage * this.state.pageSize
          ? this.state.currentPage * this.state.pageSize
          : this.state.map60.size - 1
      for (var i = startPoint; i < endPoint; i++) {
        const index = Array.from(this.state.map60.keys())[i]
        const item60 = this.state.map60.get(index)
        const item30 = this.state.map30.get(index)
        const item15 = this.state.map15.get(index)
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
      this.list = listItems
      console.log('List updated.')
      return listItems
    } else {
      var listItems = []
      for (var i = 0; i < this.state.map60.size; i++) {
        const index = Array.from(this.state.map60.keys())[i]
        const item60 = this.state.map60.get(index)
        const item30 = this.state.map30.get(index)
        const item15 = this.state.map15.get(index)
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
      this.list = listItems
      console.log('List updated.')
      return listItems
    }
  }

  handlePageFlip(current) {
    const node = this.loadRef.current
    node.toggle()
    this.setState({ currentPage: current }, () => {
      this.setState({ list: this.updateList() }, () => {
        node.toggle()
      })
    })
  }

  handlePSChange(Page) {
    const node = this.loadRef.current
    node.toggle()
    this.setState({ currentPage: 1, pageSize: Page }, () => {
      this.setState({ list: this.updateList() }, () => {
        node.toggle()
      })
    })
  }

  render() {
    const pageSize = this.state.pageSize
    const load = this.state.isLoading
    return (
      <React.Fragment>
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
                  console.log(this.update)
                  console.log('Complete fired.')
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
              display: !this.state.isLoading ? 'flex' : 'none',
            }}
          >
            <table id="dataRoot" className="flex-fill">
              <thead>
                <tr>
                  <th id="rankHead" className="flex-fill">
                    <div>
                      <p>Rank</p>
                    </div>
                  </th>
                  <th id="itemHead" className="flex-fill">
                    <div>
                      <p>Item</p>
                    </div>
                  </th>
                  <th id="hitsHead5" className="flex-fill">
                    <div>
                      <p>15 minutes</p>
                    </div>
                  </th>
                  <th id="hitsHead15" className="flex-fill">
                    <div>
                      <p>30 minutes</p>
                    </div>
                  </th>
                  <th id="hitsHead30" className="flex-fill">
                    <div>
                      <p>1 hour</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>{this.state.list}</tbody>
            </table>
          </div>
        </div>
        <Pagination
          id="pagination"
          style={{
            display: !this.state.isLoading ? 'flex' : 'none',
          }}
          className="justify-content-center"
        >
          {this.state.currentPage > 1 && (
            <Pagination.First
              onClick={() => {
                this.handlePageFlip(1)
              }}
            />
          )}
          {this.state.currentPage - 1 >= 1 && (
            <Pagination.Prev
              onClick={() => {
                const m1 = this.state.currentPage - 1
                this.handlePageFlip(m1)
              }}
            />
          )}
          {this.state.currentPage - 2 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m2 = this.state.currentPage - 2
                this.handlePageFlip(m2)
              }}
            >
              {this.state.currentPage - 2}
            </Pagination.Item>
          )}
          {this.state.currentPage - 1 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m1 = this.state.currentPage - 1
                this.handlePageFlip(m1)
              }}
            >
              {this.state.currentPage - 1}
            </Pagination.Item>
          )}
          {this.list !== undefined && (
            <Pagination.Item active>{this.state.currentPage}</Pagination.Item>
          )}
          {this.state.currentPage + 1 <=
            (this.state.map60.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p1 = this.state.currentPage + 1
                this.handlePageFlip(p1)
              }}
            >
              {this.state.currentPage + 1}
            </Pagination.Item>
          )}
          {this.state.currentPage + 2 <=
            (this.state.map60.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p2 = this.state.currentPage + 2
                this.handlePageFlip(p2)
              }}
            >
              {this.state.currentPage + 2}
            </Pagination.Item>
          )}
          {this.state.currentPage + 1 <=
            (this.state.map60.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Next
              onClick={() => {
                const n = this.state.currentPage + 1
                this.handlePageFlip(n)
              }}
            />
          )}
          {this.state.currentPage <
            (this.state.map60.size / this.state.pageSize).toFixed(0) && (
            <Pagination.Last
              onClick={() => {
                const end = (
                  this.state.map60.size / this.state.pageSize
                ).toFixed(0)
                this.handlePageFlip(end)
              }}
            />
          )}
        </Pagination>
      </React.Fragment>
    )
  }
}

export default ControlPanel2
