import React from 'react'

const compare = (a, b) => {
  return b[1] - a[1]
}

const Sort = ({ children }) => {
  return React.Children.toArray(children).sort(compare)
}

export default Sort
