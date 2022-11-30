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
import { Button, Stack } from 'react-bootstrap'

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
        const node = this.loadRef.current
        node.toggle()
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
            const node = this.loadRef.current
            node.toggle()
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
    const node = this.loadRef.current
    this.setState({ span: Span }, () => {
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
      <div className="ControlPanel">
        <div className="ControlPanelUpper">
          <ControlPanelSpan span={span} onSpanChange={this.handleSpanChange} />
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
          <table
            id="dataRoot"
            style={{
              display: !this.state.isLoading ? 'block' : 'none',
            }}
          >
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
        <Stack direction="horizontal" id="ControlPanelLower">
          {this.state.currentPage > 1 && (
            <div className="backwards">
              <Button
                onClick={() => {
                  this.handleCurrentPageChange(1)
                }}
              >
                ❮❮
              </Button>
              <Button
                onClick={() => {
                  const m1 = this.state.currentPage - 1
                  this.handleCurrentPageChange(m1)
                }}
              >
                ❮
              </Button>
            </div>
          )}
          {this.list !== undefined && (
            <Button className="currentPage">
              Current Page: {this.state.currentPage}
            </Button>
          )}
          {this.state.currentPage <
            (this.state.map.size / this.state.pageSize).toFixed(0) && (
            <div className="forwards">
              <Button
                onClick={() => {
                  console.log(
                    this.state.currentPage +
                      ' ' +
                      (this.state.map.size / this.state.pageSize).toFixed(0),
                  )
                  const p1 = this.state.currentPage + 1
                  this.handleCurrentPageChange(p1)
                }}
              >
                ❯
              </Button>
              <Button
                onClick={() => {
                  const end = (
                    this.state.map.size / this.state.pageSize
                  ).toFixed(0)
                  this.handleCurrentPageChange(end)
                }}
              >
                ❯❯
              </Button>
            </div>
          )}
        </Stack>
      </div>
    )
  }
}

export default ControlPanel
