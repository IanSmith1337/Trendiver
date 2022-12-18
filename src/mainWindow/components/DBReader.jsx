import React from 'react'
import { Pagination } from 'react-bootstrap'

class DBReader extends React.Component {
  constructor(props) {
    super(props)
    this.handlePageFlip = this.handlePageFlip.bind(this)
    this.getFBData = this.getFBData.bind(this)
    this.state = {
      currentPage: 1,
      list: [],
      maps: [new Map(), new Map(), new Map()],
    }
    window.TRBack.subscribe()
  }

  componentDidMount() {
    window.TRBack.subscriptionWatcher(() => {
      this.getFBData()
    })
  }

  async getFBData() {
    if (!this.props.isLoading) {
      this.props.toggle(true)
    }
    await window.TRBack.getDataFromFB().then((data) => {
      this.props.setNextTime(data[1])
      this.setState({ maps: data[0] }, () => {
        this.setState({ list: this.updateList() })
      })
    })
    if (this.props.isLoading) {
      this.props.toggle(false)
    }
  }

  updateList() {
    if (
      this.state.maps[2].size !== null &&
      (this.state.maps[2].size > 15 || this.state.currentPage - 1 > 0)
    ) {
      var listItems = []
      const startPoint = (this.state.currentPage - 1) * 15
      const endPoint =
        this.state.maps[2].size !== null &&
        this.state.maps[2].size >= this.state.currentPage * 15
          ? this.state.currentPage * 15
          : this.state.maps[2].size - 1
      for (var i = startPoint; i < endPoint; i++) {
        const index = Array.from(this.state.maps[2].keys())[i]
        const item60 = this.state.maps[2].get(index)
        const item30 = this.state.maps[1].get(index)
        const item15 = this.state.maps[0].get(index)
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
      return listItems
    } else {
      var listItems = []
      for (var i = 0; i < this.state.maps[2].size; i++) {
        const index = Array.from(this.state.maps[2].keys())[i]
        const item60 = this.state.maps[2].get(index)
        const item30 = this.state.maps[1].get(index)
        const item15 = this.state.maps[0].get(index)
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
      return listItems
    }
  }

  handlePageFlip(current) {
    this.props.toggle(true)
    this.setState({ currentPage: current }, () => {
      this.setState({ list: this.updateList() }, () => {
        this.props.toggle(false)
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <div id="ControlPanel" className="position-relative">
          <div
            id="ControlPanelCenter"
            style={{
              display: !this.props.isLoading ? 'flex' : 'none',
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
            display: !this.props.isLoading ? 'flex' : 'none',
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
          {this.state.list !== undefined && (
            <Pagination.Item active>{this.state.currentPage}</Pagination.Item>
          )}
          {this.state.currentPage + 1 <=
            (this.state.maps[2].size / 15).toFixed(0) && (
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
            (this.state.maps[2].size / 15).toFixed(0) && (
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
            (this.state.maps[2].size / 15).toFixed(0) && (
            <Pagination.Next
              onClick={() => {
                const n = this.state.currentPage + 1
                this.handlePageFlip(n)
              }}
            />
          )}
          {this.state.currentPage <
            (this.state.maps[2].size / 15).toFixed(0) && (
            <Pagination.Last
              onClick={() => {
                const end = (this.state.maps[2].size / 15).toFixed(0)
                this.handlePageFlip(end)
              }}
            />
          )}
        </Pagination>
      </React.Fragment>
    )
  }
}

export default DBReader
