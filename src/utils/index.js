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
  let nname = string.replace(/[|\\:$#'*?△☆"~<>]/g, ' ')
  nname = nname.replace(/[\u0250-\ue007]/g, '') // remove all the unicode range given
  nname = nname.replace(/^ +/gm, '') //replace . in the begining 
  nname = nname.replace(/\//g, "_"); //replace /
    nname = nname.replace(/^\./, "");
  if(nname.length > 230) nname = nname.substring(0,130)
   
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
export const _removeAmpSymbols = (href) => {
  return href.replace(/amp;/gim, '');
}

export const getExt = (type) => {
  const arr = [{ type: 'image/jpg' , ext : 'jpg'}, {type: 'img/gif', ext: 'gif'} ]
  let obj = arr.find((o) => o.type === type)   
  return obj.ext
}

export const isEmpty = (str) => !str.trim().length