import React from 'react'
import { Pagination } from 'react-bootstrap'

class RankingComp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <div id="rankingDisplay">
          <div
            id="RDdata"
            style={{
              display: !this.props.isLoading ? '' : 'none',
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
                  <th id="hitsHead5">
                    <div>
                      <p>15 minutes</p>
                    </div>
                  </th>
                  <th id="hitsHead15">
                    <div>
                      <p>30 minutes</p>
                    </div>
                  </th>
                  <th id="hitsHead30">
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
            display: !this.props.isLoading ? '' : 'none',
          }}
        >
          {this.props.currentPage > 1 ? (
            <Pagination.First
              onClick={() => {
                this.props.pageFlip(1)
              }}
            />
          ) : (
            <Pagination.First
              disabled
              onClick={() => {
                this.props.pageFlip(1)
              }}
            />
          )}
          {this.props.currentPage - 1 >= 1 ? (
            <Pagination.Prev
              onClick={() => {
                const m1 = this.props.currentPage - 1
                this.props.pageFlip(m1)
              }}
            />
          ) : (
            <Pagination.Prev
              disabled
              onClick={() => {
                const m1 = this.props.currentPage - 1
                this.props.pageFlip(m1)
              }}
            />
          )}
          <Pagination.Item>{this.props.currentPage}</Pagination.Item>
          {this.props.currentPage + 1 <=
          (this.props.maps[2].size / 15).toFixed(0) ? (
            <Pagination.Next
              onClick={() => {
                const n = this.props.currentPage + 1
                this.props.pageFlip(n)
              }}
            />
          ) : (
            <Pagination.Next
              disabled
              onClick={() => {
                const n = this.props.currentPage + 1
                this.props.pageFlip(n)
              }}
            />
          )}
          {this.props.currentPage <
          (this.props.maps[2].size / 15).toFixed(0) ? (
            <Pagination.Last
              onClick={() => {
                const end = (this.props.maps[2].size / 15).toFixed(0)
                this.props.pageFlip(end)
              }}
            />
          ) : (
            <Pagination.Last
              disabled
              onClick={() => {
                const end = (this.props.maps[2].size / 15).toFixed(0)
                this.props.pageFlip(end)
              }}
            />
          )}
        </Pagination>
      </>
    )
  }
}

export default RankingComp
