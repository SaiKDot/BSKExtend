import ChanDownloader  from './Chan'
import $ from 'jquery'
export default class _4Archive extends ChanDownloader {
  constructor() {
    super()
    this.appendButton()
    this.getLinks()
    this.downloadFiles()
    this.downloadAriaEvent()
  }
  appendButton() {
    $('.file').first().append(this.dirDwn)
  }

  getLinks() {
    let h2t = $('.postInfo').find('.subject').text()
    h2t = h2t
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s*$/, '')
      .trim()
    console.log(h2t)
    let xf = $('.postMessage').first().text()
    let snt = xf
      .split(' ')
      .slice(0, 6)
      .join(' ')
      .trim()
      .replace(/[^a-z0-9\s]/gi, '')
    snt = snt.replace(/\n/g, ' ')
    snt = snt.replace('br', ' ')

    this.postTitle = h2t == '' || h2t == null ? snt : h2t
    this.threadID = $('.thread').first().attr('id').replace('t', '')  
     
    const links = $('.postContainer').find('.fileText').find('a:first')
    links.each((i, o) => {      
      let lname = o.text
      let title = o.title
      title = title.replace('Full size of ','')
      let filename
      if (title == null || title == '' || title == undefined) {
        filename = lname.substring(lname.lastIndexOf('/') + 1)
      } else {
        filename = title
      }
      var url = o.href
      this.downloadArray.push({
        title: filename,
        link: url,
      })
    })
     
  }
  downloadFiles() {
    $('#drDwn').on('click', async () => {
      let message = await this.sendMessage({
        message: 'downloadBulk',
        linksArray: this.downloadArray,
      })

      message.success ? console.log(message) : console.error(message)
    })
  }
  downloadAriaEvent() {
    $('#dwnaria').on('click', () => {
      let dirOut = `${this.postTitle} - ${this.threadID}`
      console.log(dirOut)
      this.createAria2Array(dirOut)
      this.downloadAria()
    })
  }
}

