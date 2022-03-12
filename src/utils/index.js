import axios from 'axios'
export const childrenMatches = (elem, selector) => {
  return Array.prototype.filter.call(elem.children, function (child) {
    return child.matches(selector)
  })
}
export const toType = (obj) => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

export const convertToValidFilename = (string) => {
  let nname = string.replace(/[\/|\\:$#'*?△☆"~<>]/g, ' ')
  nname = nname.replace(/[\u0250-\ue007]/g, '')
  nname = nname.replace(/^\./, '')
  nname = nname.replace(/^ +/gm, '')

  return nname
}

export const api = axios.create({  
  headers: {
    'Content-Type': 'application/json',
  },
})
 
export const wait = (ms) => {
  return new Promise((res) => setTimeout(res, ms))
}
