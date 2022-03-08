import $ from 'jquery'
import axios from 'axios'
// import {childrenMatches} from '../utils'
import {convertToValidFilename} from '../utils'
 
export default class Reddit {
  constructor() {
    this.init()
    this.post, this.url, this.sub, this.domain, this.ext, this.title, this.parts
  }
  init() {
    this.setRedditMenu()
  }
  setRedditMenu() {
    let list = $('.thing').find('.buttons')
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
        let el = e.target
        this.post = el.closest('.thing')
        this.url = this.post.getAttribute('data-url')
        this.sub = this.post.getAttribute('data-subreddit')
        this.domain = this.post.getAttribute('data-domain')
        this.ext = this.url.split('.').pop()
        console.log(this.domain)
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
      })
    )
  }
  getImgur() {
    let post = this.post,
      sub = this.sub
    $(post).find('.dwnlist').hide()
    $(post)
      .find('.buttons')
      .append(
        '<li class="confirm"> <span class="action">format? <a class="option" data-format="img" href="#0"> img &nbsp;</a><a class="option" data-format="vid" href="#0"> vid</a></span> &nbsp;/&nbsp; <span class="action error cancel"> cancel</span> </li>'
      )
    $('.error').css('cursor', 'pointer')
    document.querySelectorAll('span.cancel').forEach((el) =>
      el.addEventListener('click', (e) => {
        $(post).find('.confirm').remove()
        $(post).find('.dwnlist').show()
      })
    )
    document.querySelectorAll('a.option').forEach((el) =>
      el.addEventListener('click', (e) => {
        e.preventDefault()
        let formt = e.target.getAttribute('data-format'),
          regex = /imgur\.com\/(\w{7})/,
          parts = this.url.match(regex)[1],
          dwnUrl,
          title
        console.log(formt)

        if (formt == 'vid') {
          dwnUrl = 'https://i.imgur.com/' + parts + '.mp4'
          title = $(post).find('a.title').text() + '-' + sub + '.mp4'
        } else if (formt == 'img') {
          dwnUrl = 'https://i.imgur.com/' + parts + '.jpg'
          title = $(post).find('a.title').text() + '-' + sub + '.jpg'
        }

        chrome.runtime.sendMessage(
          { message: 'downloadFile', link: dwnUrl, name: title },
          function (response) {
            console.log({ response })
          }
        )
        $(post).find('.confirm').remove()
        $(post).find('.dwnlist').show()
      })
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
  getGfycat() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      url = this.url
    console.log(url)
    let title = $(post).find('a.title').text() + '-' + sub + '.mp4'
    chrome.runtime.sendMessage({ message: 'getGfy', link: url, name: title })
  }
  getdirect() {
    if(this.url.includes('.gif')) {
      this.getRedditGif()
    } else {
      this.directDownload()
    }
  }
  getRedditGif() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      url = 'https://www.reddit.com/' + this.post.getAttribute('data-permalink') + '.json'
    let title = $(post).find('a.title').text() + '-' + sub + '.mp4'
    chrome.runtime.sendMessage({ message: 'getRedditgif', link: url, name: title })
  }
  getRedditVideo() {
     let post = this.post,
      sub = this.sub,
      ext = this.ext,
      url = 'https://www.reddit.com/' + this.post.getAttribute('data-permalink') + '.json'
      console.log(url)
      let title = $(post).find('a.title').text() + '-' + sub + '.mp4'
      chrome.runtime.sendMessage({ message: 'redditVideo', link: url, name: title })
  }
  directDownload() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      dwnUrl = this.url,
      title
    title = $(post).find('a.title').text() + '-' + sub + '.' + ext
    title = convertToValidFilename(title)
    chrome.runtime.sendMessage(
      { message: 'downloadFile', link: dwnUrl, name: title },
      function (response) {
        console.log({ response })
      }
    )
  }
}