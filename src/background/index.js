 
import { string } from 'prop-types'
const cheerio = require('cheerio')
 
import { convertToValidFilename } from '../utils'
 

export default class EventTasks {
  constructor() {
    this.init()
    this.fileName
    this.url
    this.audioFname
    this.videoFname
  }
  init() {
    chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
      suggest({
        filename: this.fileName,
        conflictAction: 'uniquify',
      })
    })
    chrome.runtime.onInstalled.addListener(() => {
      chrome.storage.local.set({
        name: 'BSK',
      })
    })
    chrome.storage.local.get('name', (data) => {
      console.log(data)
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request.link)
      switch (request.message) {
        case 'downloadFile':
          {
            this.url = request.link
            this.fileName = request.name
            this.downloadFile()
          }
          break
        case 'waifuist':
          {
            let ft = request.fol_title
            let thpathprot = request.thrName
          }
          break
        case 'getGfy':
          {
            this.fileName = convertToValidFilename(request.name)
            let gurl = request.link,
              src
            fetch(gurl)
              .then((response) => {
                return response.text()
              })
              .then((responseText) => {
                const $ = cheerio.load(responseText)
                let ma = $('video.media')
                  .find('source')
                  .each((i, o) => {
                    if (
                      o.attribs.type == 'video/mp4' &&
                      !o.attribs.src.includes('-mobile')
                    ) {
                      src = o.attribs.src
                      console.log(src)
                    }
                  })
                this.url = src
                this.downloadFile()
              })
              .catch((error) => console.log('Error:', error))
          }
          break
        case 'getRedditgif':
          {
            this.fileName = convertToValidFilename(request.name)
            let gurl = request.link
            fetch(gurl)
              .then((response) => {
                return response.json()
              })
              .then((resp) => {
                console.log(resp)
                var data =
                  resp[0].data.children[0].data.preview.images[0].variants.mp4
                    .source.url
                if (data) {
                  let daturl = data.replace('&amp;', '&')
                  this.url = daturl
                  this.downloadFile()
                }
              })
          }
          break
        case 'redditVideo': {
          let gname = convertToValidFilename(request.name)
          let gurl = request.link
          this.getRedditVid(gurl, gname)
        }
        default:
          return true
      }
      return true
    })
  }
  async getRedditVid(gurl, fname) {
    let vidUrl, audioUrl
    fetch(gurl)
      .then((response) => {
        return response.json()
      })
      .then((resp) => {
        console.log(resp)
        var fallback_url =
          resp[0].data.children[0].data.secure_media.reddit_video.fallback_url
        if (fallback_url) {
          vidUrl = fallback_url
          fname = this.videoFname = fname.replace('.mp4', '-video.mp4')
          this.fileName = fname
          this.url = vidUrl
          console.log({ vidUrl })
          // this.downloadFile()
          let mediaUrl = fallback_url.split('https://v.redd.it/')[1]
          console.log({ mediaUrl })
          let mediaId = mediaUrl.split('/')[0]
          fname = fname.replace('-video.mp4', '-audio.mp4a')
          this.fileName = this.audioFname = fname
          let aurl = vidUrl.split('DASH_480.mp4')[0]
          console.log(aurl)
          audioUrl = aurl + 'DASH_audio.mp4'
          this.url = audioUrl
          // this.downloadFile()
          this.generateBatFile()
           this.downloadFile()
        }
      })
      .then(() => {})
  }

  downloadFile() {
    chrome.downloads.download({
      url: this.url,
      conflictAction: 'uniquify',
      saveAs: false,
    })
  }

  generateBatFile() {
   let batchStr = [
     '@echo off',
     'setlocal enabledelayedexpansion',
     'chcp 65001',
     'ffmpeg -version',
     'if errorlevel 1 (',
     '  echo "ffmpeg not found"',
     '  @pause',
     '  exit',
     ')',
     'SET "filename=' + this.videoFname + '"',
     'echo "filename: %filename%"',
     'echo "cd: %cd%"',
     'dir',
     '@pause',
     "(FOR /R %%i IN (*.ts) DO @echo file 's/%%~nxi') > list.txt",
     'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "%filename%.mp3"',
     'del "list.txt"',
     'echo "success"',
     '@pause',
   ]
     .join('\r\n')
     .toString()
    
  
    // let url =
    //   'data:text/plain;base64,' +
    //   '@echo off' 
    //   ;
    
      let url = 'data:text/plain;base64,' +  batchStr 
    console.log({ url })
    this.url = url
    let filename = this.videoFname.replace('.mp4', '.bat')
    this.fileName = filename
    console.log('fname', this.fileName)
      
  }
  getForum(gurl) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var resp = xhr.responseText
          let body = $('video.video').html()
          resolve(body)
        } else {
          console.log(response)
          reject()
        }
      }
    })
  }

  // scrapeVid() {
  //    proc.addInput(`https://v.redd.it/${mediaId}/DASH_${res}`)
  //   .output(`${outputFolder}${mediaId}-${res}.mp4`)
  //   .on("error", err => {
  //     console.log("Error: " + err);
  //   })
  //   .on("end", () => {
  //     console.log("Done");
  //   });
  // }
}

let eventTasks = new EventTasks()
