import React from 'react'
import { Pagination } from 'react-bootstrap'

class DBReader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div id="ControlPanel">
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
              <tbody>{this.props.list}</tbody>
            </table>
          </div>
        </div>
        <Pagination
          id="pagination"
          style={{
            display: !this.props.isLoading ? 'flex' : 'none',
          }}
          className="justify-content-center mt-auto"
        >
          {this.props.currentPage > 1 && (
            <Pagination.First
              onClick={() => {
                this.props.pageFlip(1)
              }}
            />
          )}
          {this.props.currentPage - 1 >= 1 && (
            <Pagination.Prev
              onClick={() => {
                const m1 = this.props.currentPage - 1
                this.props.pageFlip(m1)
              }}
            />
          )}
          {this.props.currentPage - 2 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m2 = this.props.currentPage - 2
                this.props.pageFlip(m2)
              }}
            >
              {this.props.currentPage - 2}
            </Pagination.Item>
          )}
          {this.props.currentPage - 1 >= 1 && (
            <Pagination.Item
              onClick={() => {
                const m1 = this.props.currentPage - 1
                this.props.pageFlip(m1)
              }}
            >
              {this.props.currentPage - 1}
            </Pagination.Item>
          )}
          {this.props.list !== undefined && (
            <Pagination.Item active>{this.props.currentPage}</Pagination.Item>
          )}
          {this.props.currentPage + 1 <=
            (this.props.maps[2].size / 15).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p1 = this.props.currentPage + 1
                this.props.pageFlip(p1)
              }}
            >
              {this.props.currentPage + 1}
            </Pagination.Item>
          )}
          {this.props.currentPage + 2 <=
            (this.props.maps[2].size / 15).toFixed(0) && (
            <Pagination.Item
              onClick={() => {
                const p2 = this.props.currentPage + 2
                this.props.pageFlip(p2)
              }}
            >
              {this.props.currentPage + 2}
            </Pagination.Item>
          )}
          {this.props.currentPage + 1 <=
            (this.props.maps[2].size / 15).toFixed(0) && (
            <Pagination.Next
              onClick={() => {
                const n = this.props.currentPage + 1
                this.props.pageFlip(n)
              }}
            />
          )}
          {this.props.currentPage <
            (this.props.maps[2].size / 15).toFixed(0) && (
            <Pagination.Last
              onClick={() => {
                const end = (this.props.maps[2].size / 15).toFixed(0)
                this.props.pageFlip(end)
              }}
            />
          )}
        </Pagination>
      </React.Fragment>
    )
  }
}

export default DBReader
