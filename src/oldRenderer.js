/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

function updateList(sortedEntities, adds, subs, page) {
  if (sortedEntities.size > pageSize || page > 1) {
    const startPoint = page * pageSize
    const endPoint =
      sortedEntities.size >= (page + 1) * pageSize
        ? (page + 1) * pageSize
        : sortedEntities.size - 1
    var deltaPos = 0
    var deltaNeg = 0
    for (var i = startPoint; i < endPoint; i++) {
      const index = Array.from(sortedEntities.keys())[i]
      const item = sortedEntities.get(index)
      const numberedItem = document.createElement('li')
      if (adds.get(index) || subs.get(index)) {
        if (adds.get(index)) {
          deltaPos += adds.get(index)
        }
        if (subs.get(index)) {
          deltaNeg += subs.get(index)
        }
        if (deltaPos > deltaNeg) {
          console.log(
            'Item: ' +
              index +
              ', (+)' +
              (deltaPos - deltaNeg) +
              ', D+: ' +
              deltaPos +
              ', D-: ' +
              deltaNeg,
          )
          const NITextChanges = document.createTextNode(
            index + ': ' + item + ' (+' + (deltaPos - deltaNeg) + ')',
          )
          listRoot.appendChild(numberedItem)
          numberedItem.appendChild(NITextChanges)
        } else {
          if (deltaNeg > deltaPos) {
            console.log(
              'Item: ' +
                index +
                ', (-)' +
                (deltaPos - deltaNeg) +
                ', D+: ' +
                deltaPos +
                ', D-: ' +
                deltaNeg,
            )
            const NITextChanges = document.createTextNode(
              index + ': ' + item + ' (-' + (deltaNeg - deltaPos) + ')',
            )
            listRoot.appendChild(numberedItem)
            numberedItem.appendChild(NITextChanges)
          } else {
            console.log(
              'Item: ' + index + ', (~), D+: ' + deltaPos + ', D-: ' + deltaNeg,
            )
            const NITextNoChange = document.createTextNode(index + ': ' + item)
            listRoot.appendChild(numberedItem)
            numberedItem.appendChild(NITextNoChange)
          }
        }
        deltaNeg = 0
        deltaPos = 0
      } else {
        const NITextNoChange = document.createTextNode(index + ': ' + item)
        listRoot.appendChild(numberedItem)
        numberedItem.appendChild(NITextNoChange)
      }
      const numVal = document.createAttribute('value')
      numVal.value = i + 1
      numberedItem.attributes.setNamedItem(numVal)
    }
    if (page >= 1) {
      document.body.appendChild(prevButton)
      if (prevButton.getAttribute('listener') == null) {
        prevButton.addEventListener('click', function () {
          currentPage--
          updateList(sorted, this.state.aMap, this.state.sMap, currentPage)
        })
        prevButton.attributes.setNamedItem(document.createAttribute('listener'))
      }
    }
    document.body.appendChild(nextButton)
    if (nextButton.getAttribute('listener') == null) {
      nextButton.addEventListener('click', function () {
        currentPage++
        updateList(sorted, this.state.aMap, this.state.sMap, currentPage)
      })
      nextButton.attributes.setNamedItem(document.createAttribute('listener'))
    }
  } else {
    sortedEntities.forEach((item, index) => {
      const numberedItem = document.createElement('li')
      const NIText = document.createTextNode(index + ': ' + item)
      listRoot.appendChild(numberedItem)
      numberedItem.appendChild(NIText)
    })
  }
  console.log('Fill complete.')
}
