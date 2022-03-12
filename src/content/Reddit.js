import $ from 'jquery'
import axios from 'axios'
// import {childrenMatches} from '../utils'
import { convertToValidFilename, wait } from '../utils'
 
 

export default class Reddit {
  constructor() {
    this.post,
      this.url,
      this.sub,
      this.domain,
      this.ext,
      this.title,
      this.parts,
      (this.postIdContainer = []),
      (this.lastLength = 0),
      (this.supportedExtensions = [
        'png',
        'jpg',
        'jpeg',
        'gif',
        'gifv',
        'mp4',
        'mp3',
      ])
    this.init()
  }
  init() {
    var self = this

    window.addEventListener('neverEndingLoad', function () {
      self.setRedditMenu()
    })
    // $('.rpBJOHq2PR60pnwJlUyP0').on('DOMNodeInserted', function (e) {
    //   console.log(e.target.parentNode)
    // })
    this.addListenerNew()
    this.setRedditMenu()
  }

  async pageUpdateChecker() {
    while (true) {
      await wait(50)
      if (true) {
        this.newMenu()
      }
    }
  }

  setRedditMenu() {
    var so = this
    let list = $('.thing').find('.buttons')
    if (list.length == 0) {
      //const postCheckInterval = setInterval(() => this.newMenu(), 500)
      this.pageUpdateChecker()
      // this.addListenerNew()
    } else {
      this.oldMenu(list)
    }
  }

  oldMenu(list) {
    let but =
      '<li class="dwnlist"> <a href="#0" class="exdownload"> download</a> </li>'
    list.each(function () {
      $(this).find('.dwnlist').remove('.dwnlist')
      $(this).append(but)
    })

    let downloadbuttons = $('.exdownload')

    Array.from(downloadbuttons).forEach((el) =>
      el.addEventListener('click', (e) => {
        e.preventDefault()
        let elem = e.target
        // this.getData(elem)
      })
    )
  }

  newMenu() {
    const menu =
      '<button class="download-button-sk"><span class="pthKOcceozMuXLYrLlbL1"><i class="icon icon-download"></i></span><span class="_2-cXnP74241WI7fpcpfPmg _70940WUuFmpHbhKlj8EjZ">download</span></button>'
    const postContainers = $('[data-testid="post-container"]')
    // const self = this

    if (postContainers.length != this.lastLength) {
      Array.from(postContainers).forEach((el) => {
        const postComment = $(el).find('._3-miAEojrCvx_4FQ8x3P-s')

        if (
          el.classList.contains('promotedvideolink') ||
          el.classList.contains('promotedlink') ||
          el == undefined
        ) {
          return
        }
        if ($(postComment).find('.download-button-sk').length == 0) {
          postComment.prepend(menu)
        }
      })

      this.lastLength = postContainers.length
    }
  }

  addListenerNew() {
    var self = this
    $(document)
      .off()
      .on('click', '.download-button-sk', function (e) {
        e.preventDefault()
        // if (e.target !== this) return
        let elem = e.target
        self.getDataNew(elem)
      })
  }

  async getDataNew(el) {
    const post = el.closest('.Post')
    const iop = $('[data-testid="post_timestamp"]')
    const tmstmp = $(post).find(iop)
    let href = $(tmstmp).attr('href')
    href += '.json'
    const req = await fetch(href)
    const resp = await req.json()
    const data = resp[0].data.children[0].data
    console.log(data)
    this.url = data.url
    if (!data.url) {
      this.url = data.url_overridden_by_dest
    }
    this.sub = data.subreddit
    this.ext = this.url.split('.').pop()
    this.domain = data.domain
    this.title = data.title

    if (this.supportedExtensions.includes(this.ext)) {
      this.directDownload()
    }
    else {
      this.delegateDomain()
    }

    let isSelf = data.isSelf
    if (isSelf == false) {
      this.delegateDomain()
    }
  }
  delegateDomain() {
    switch (this.domain) {
      case 'imgur.com':
        this.getImgur()
        break
      case 'i.imgur.com':
        this.imgurDirectDownload()
        break
      case 'gfycat.com':
        this.getGfycat()
        break
      case 'i.redd.it':
        this.getdirect()
        break
      case 'v.redd.it':
        this.getRedditVideo()
        break
      default:
        this.directDownload()
    }
  }

  getImgur() {
    let id = this.url.replace(/.*\//gim, '')
    let isAlbum = this.url.replace(/.*imgur.com\//gim, '').startsWith('a')
    return isAlbum ? this.getAlbumLinks(id) : this.getGalleryLinks(id)
  }
  async getGalleryLinks() {
     chrome.runtime.sendMessage({ message: 'loadImgurPage', link: this.url},
     function (response) {
       console.log({ response })
     }
   )
  }

  imgurDirectDownload() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      dwnUrl = this.url,
      url,
      title
    if (ext == 'gifv' || ext == 'gif') {
      url = dwnUrl.slice(0, -4) + 'mp4'
      console.log(url)
      title = $(post).find('a.title').text() + '-' + sub + '.' + 'mp4'
    } else {
      title = $(post).find('a.title').text() + '-' + sub + '.' + ext
      url = dwnUrl
    }
    title = convertToValidFilename(title)
    chrome.runtime.sendMessage(
      { message: 'downloadFile', link: url, name: title },
      function (response) {
        console.log({ response })
      }
    )
  }

  directDownload() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      dwnUrl = this.url,
      title = convertToValidFilename(this.title)
    console.log({ title })
    title = title + '-' + sub + '.' + ext
    if (ext == 'gifv' || ext == 'gif') {
      dwnUrl = dwnUrl.slice(0, -4) + 'mp4'
      console.log(dwnUrl)
      title = title.replace('gifv', 'mp4')
    }

    chrome.runtime.sendMessage(
      { message: 'downloadFile', link: dwnUrl, name: title },
      function (response) {
        console.log({ response })
      }
    )
  }
}

