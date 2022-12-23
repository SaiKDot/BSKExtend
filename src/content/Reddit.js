import $ from 'jquery'
import axios from 'axios'
// import {childrenMatches} from '../utils'
import {
  convertToValidFilename,
  wait,
  _removeAmpSymbols,
  getExt,
} from '../utils'
 
 

export default class Reddit {

  constructor() {
    var self = this
    this.post,
    this.url,
    this.sub,
    this.domain,
    this.ext,
    this.title,
    this.parts,
    this.media_metadata,
    this.postIdContainer = [],
    this.lastLength = 0,
    this.supportedExtensions = [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'gifv',
      'mp4',
      'mp3',
    ]
    this._ApiEndpoint = 'https://api.imgur.com/3/'
    this.imgurInfo
    chrome.storage.sync.set({ imgurInfo: { client_id: 'ff21f6fc51cefd4' } })
    chrome.storage.sync.get(['imgurInfo'], function (result) {
      self.imgurInfo = result.imgurInfo
    })
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
    // console.log(JSON.stringify(data))
    console.log(data)
    this.url = data.url
    
    if (!data.url) {
      this.url = data.url_overridden_by_dest
    }
    this.sub = data.subreddit
    this.ext = this.url.split('.').pop()
    this.domain = data.domain
    this.title = data.title
    this.media_metadata = data.media_metadata
     if ((this.media_metadata == null || this.media_metadata == undefined) && data.crosspost_parent_list ) {
        this.media_metadata = data.crosspost_parent_list[0].media_metadata
    }
    this.fallbackUrl = data.secure_media.reddit_video.fallback_url
    this.fallbackUrl = this.fallbackUrl.replace('?source=fallback', '')
    if (this.supportedExtensions.includes(this.ext)) {
      this.directDownload()
    } else {
      this.delegateDomain()
    }

    let isSelf = data.isSelf
    if (isSelf == false) {
      this.delegateDomain()
    }
  }
  delegateDomain() {
    console.log(this.domain)
    switch (this.domain) {

      case  'i.imgur.com' :
      case  'imgur.com' : {        
        const imgurDownloader = new ImgurDownloader(
          this.url,
          this.domain,
          this.sub,         
          this.title
        )
        // imgurDownloader.getImages()
            
      }
            
      break
      case '//gfycat.com/':
      case 'gfycat.com':
        const gfycat = new GfyCatDownloader(
          this.url,
          this.domain,
          this.sub,
          this.title
        )
        break
      case 'i.redd.it':
        this.getdirect()
        break
      case 'v.redd.it':
        this.getRedditVideo = new RedditVideo(
          this.url,
          this.domain,
          this.sub,
          this.title,
          this.media_metadata,
          this.fallbackUrl
        )
        break
      case 'reddit.com' : {
        const redditdownload = new RedditDownloader(
          this.url,
          this.domain,
          this.sub,
          this.title,
          this.media_metadata          
        )
      }        
      break
      case 'giphy.com' : {         
        const giphydownload = new GiphyDownloader(
          this.url,
          this.domain,
          this.sub,
          this.title
        )
      }
      break
      case '//redgifs.com':
      case 'redgifs.com': {
          const redgifs = new RedGifsDownloader(
            this.url,
            this.domain,
            this.sub,
            this.title
          )
      }
      break
      default:
        this.directDownload()
    }
  }



}

class BaseDownloader {

  sendMessage(request) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(request, (response) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }
}

class ImgurDownloader extends BaseDownloader {
  constructor(url, domain, sub, title) {
    super()
    this.url = url,
    this.domain = domain,
    this.sub = sub,
    this.title = title,
    // this.apiUrl,
    this.ext
    this.init()
  }
  init() {
    console.log('domain', this.domain)
    this.domain == 'imgur.com' ? this.getAlbum() : this.imgurDirectDownload()
  }

  getAlbum() {
    let albumID = this.url.replace(/.*\//gim, '')
    let isAlbum = this.url.replace(/.*imgur.com\//gim, '').startsWith('a')
    // this.apiUrl = `https://imgur.com/gallery/${albumID}.json`
    return this.getGalleryLinks(albumID)
  }

  async getGalleryLinks(albumID) {
    var self = this
    let data
    let message = await this.sendMessage({
      message: 'loadImgurPage',
      link: `https://imgur.com/gallery/${albumID}.json`,
    })
    console.log(message)
    message.success
      ? (data = message.response.data.image)
      : console.error(message)
    if (data.is_album == true || data.in_gallery == true) {
      let imgData
      if (data.is_album == true) {
        imgData = data.album_images.images
      } else {
        this.ext = data.ext
        imgData = data.galleryTags
      }
      let i = 0
      let links = imgData.reduce((a, c) => {
        i++
        let ext = c.ext ? c.ext : self.ext
        let link = `https://i.imgur.com/${c.hash}${ext}`
        let title = `${convertToValidFilename(this.title)} - ${
          this.sub
        } [${i}]${ext}`
        // let title = convertToValidFilename(this.title) + ' - ' + i + ext
        a.push({ link, title })
        return a
      }, [])

      let m = await this.sendMessage({
        message: 'downloadBulk',
        links: links,
      })
      return
    }
    return
  }

  async imgurDirectDownload() {
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
    let mes = await this.sendMessage({
      message: 'downloadFile',
      link: url,
      name: title,
    })
    mes.response ? console.log(mes.response) : console.info(mes.error)
    return
  }

  async directDownload() {
    let post = this.post,
      sub = this.sub,
      ext = this.ext,
      dwnUrl = this.url,
      title = convertToValidFilename(this.title)
    title = title + '-' + sub + '.' + ext
    if (ext == 'gifv' || ext == 'gif') {
      dwnUrl = dwnUrl.slice(0, -4) + 'mp4'
      title = title.replace('gifv', 'mp4')
    }

    let mes = await this.sendMessage({
      message: 'downloadFile',
      link: dwnUrl,
      name: title,
    })
  }
}

class RedditDownloader extends BaseDownloader {
    constructor(url, domain, sub, title, media_metadata) {
        super()
        this.url = url,
        this.domain = domain,
        this.sub = sub,
        this.title = title,
        // thisredditVideo.ext,
        this.media_metadata = media_metadata
        this.videoFname
        this.fallback_url = fallback_url
        this.init()
    }
    init() {
      if(this.domain = 'v.reddit.com') this.redditVideo()
      this.url.includes('reddit.com/gallery/') ? this.redditGallery() : console.log('default')
    }
    async redditGallery() {
       var self = this
       let media_keys = Object.keys(this.media_metadata)
       let links = []
       media_keys.forEach((k, i) => {         
         const key = k
         const link = _removeAmpSymbols(this.media_metadata[k].s.u) 
         const title = `${this.title} - ${self.sub} [${i}].${getExt(this.media_metadata[k].m)}`         
         links.push({ link , title})
       })
       console.log(links)
       if (!Array.isArray(links)) links = [links]       
      let m = await this.sendMessage({ message: 'downloadBulk', links: links })
      console.log(m.response)
      return 
    }
   
}
class RedditVideo extends BaseDownloader {

    constructor(url, domain, sub, title, media_metadata,fallback_url) {
          super()
          this.url = url,
          this.domain = domain,
          this.sub = sub,
          this.title = title,         
          this.media_metadata = media_metadata
          this.videoFname
          this.fallback_url = fallback_url
          this.fileName
          this.getVid()
    }
    
    getVid() {
        
          this.title = this.title + '-' + this.sub + '.mp4'   
          let vidUrl = this.fallback_url
          let dash = this.getDash(this.fallback_url)
          let videofname = this.title.replace('.mp4', '-video.mp4')          
          console.log({ vidUrl, videofname })
          
          let audiofname = videofname.replace('-video.mp4', '-audio.mp4a')
          // this.fileName = this.audioFname = fname
          let aurl = vidUrl.split('DASH_480.mp4')[0]
          console.log({aurl})
          let audioUrl = aurl + 'DASH_audio.mp4'
          console.log({ audioUrl })
      
    }
    getDash(url) {
      var surl = url.substring(
        url.indexOf('dash_') + 1,
        url.lastIndexOf('.')
      )

      console.log({ surl })

    }
}
class GiphyDownloader extends  BaseDownloader {
  constructor(url, domain, sub, title) {
    super()    
    this.url = url,
    this.domain = domain,
    this.sub = sub,
    this.title = title,   
    this.ext
    this.init()
  }
  async init() {
     const title = `${convertToValidFilename(this.title)} - ${this.sub}.mp4`
     let message = await this.sendMessage({
       message: 'loadGiphyPage',
       link: this.url,
       title:title
     })
    
    
     message.success  ? (data = message.response.data.image) : console.error(message)
  }  

}


class GfyCatDownloader extends BaseDownloader {
  constructor(url, domain, sub, title) {
    super()    
    this.url = url,
    this.domain = domain,
    this.sub = sub,
    this.title = title,
    this.ext
    this.init()
  }
  async init() {
    let title =  `${this.title} - ${this.sub}.mp4`
    let link = this.formLink()
    const message = await this.sendMessage({ message: 'loadgfycatpage', link: this.url })
    message.success  ? this.url = this.parsePage(message.response) : console.error(message)
    
    await this.sendMessage({ message: 'downloadFile',name:title, link: this.url }) 
  
    return
  }
  parsePage(dat) {    
    const dom = $(dat)
    let url;
    dom.filter('script').each(function(){
      const obj = $(this);
      const tag = obj[0]
      if (tag.type == 'application/ld+json') {
        let l = $(tag)[0]
        let str = l.innerHTML       
        let ev = JSON.parse(str)
        const mp4Url = ev.video.contentUrl
        
        url = mp4Url
        return
      }
    })
     
      
     return url
  }
  
}

class RedGifsDownloader extends BaseDownloader {
  constructor(url, domain, sub, title) {
    super()    
    this.url = url,
    this.domain = domain,
    this.sub = sub,
    this.title = title,   
    this.ext
    this.init()
  }
  async init() {
    // const link  = this.getLink()
    const title = `${this.title} - ${this.sub}.mp4`
    const message = await this.sendMessage({ message: 'loadPage', link: this.url })
    message.success  ? this.url = this.parsePage(message.response) : console.error(message)
    await this.sendMessage({ message: 'downloadFile',name:title, link: this.url }) 
    return
  }
  parsePage(dat) {    
    const dom = $(dat)
    let url;
    dom.filter('script').each(function(){
      const obj = $(this);
      const tag = obj[0]
      if (tag.type == 'application/ld+json') {
        let l = $(tag)[0]
        let str = l.innerHTML       
        let ev = JSON.parse(str)
        console.log(ev)
        let mp4Url = ev.video.contentUrl
        mp4Url = mp4Url.replace('-mobile.mp4','.mp4')        
        url = mp4Url
        console.log(url)
        return
      }
    })     
      
     return url
  } 
}

