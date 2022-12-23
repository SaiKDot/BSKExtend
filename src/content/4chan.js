import $ from 'jquery'
import { convertToValidFilename } from '../utils'
export default class _4chanManager {
  constructor() {
    this.addButton()
    this.addListener()
    $('.thread').on('DOMNodeInserted', function (e) {
      console.log(e.target.parentNode)
    })
  }

  addButton() {
    $('.postContainer')
      .find('.fileText')
      .remove('.exbutton')
      .append('<button class="exbutton d1" type="button">download</button>')
  }
  addListener() {
     var self = this
     $(document).off().on('click', '.exbutton', function (e) {
         e.preventDefault()        
         const file = $(this).closest('.file')[0]
         self.getData(file)
     })
  }
  getData(el) {
    console.log(el)
    let link = $(el).find('.fileText').find('a').attr('href')
    link = 'https:' + link
    let text = $(el).find('.fileText').find('a').attr('title')
    if(text == undefined || text === '') {
      text = $(el).find('.fileText').find('a').text()
    }
    let ext = link.split('.').pop()
    let name = convertToValidFilename(text) + '.' + ext
    name = name.replace(/\.[^/.]+$/,'')
    chrome.runtime.sendMessage({message: 'downloadFile', link:link, name:name }, (response) => {
      if (response.success) {
        console.log(response)
      } else {
      }
    })
  }
}
