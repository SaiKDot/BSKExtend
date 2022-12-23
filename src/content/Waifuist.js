import ChanDownloader from './Chan'
import $ from 'jquery'
import '../content.css'
import { convertToValidFilename } from '../utils'

export default class Waifuistw extends ChanDownloader {
  constructor(domain) {
    super()
    // this.init()
    this.appendButton()
    this.domain = domain
    this.getLinks()
    this.downloadAriaEvent()
  }
  appendButton() {
    const titlepane = $('.opHead').first()
    titlepane.append(this.dirDwn)
  }
  getLinks() {
    this.postTitle = convertToValidFilename(
      $('.opCell').find('.labelSubject').text()
    )
    if (this.postTitle.length == 0 || this.postTitle == undefined) {
      this.postTitle = convertToValidFilename(document.title)
    }

    this.threadID = $('.opCell').attr('id')

    const orLink = $('.opCell').find('.originalNameLink')

    for (let i = 0; i < orLink.length; i++) {
      let title = orLink[i].download != '' ? orLink[i].download : orLink[i].text
      let link = orLink[i].href
      this.downloadArray.push({ title, link })
    }
    console.log(this.downloadArray)
  }
  downloadAriaEvent() {
    $('#dwnaria').on('click', (e) => {
      e.preventDefault()
       
      
      this.appendModal().then(this.modalEvents())
      // this.downloadAria()
    })
  }
  async downloadFiles() {
    let message = await this.sendMessage({
      message: 'downloadBulk',
      linksArray: this.downloadArray,
    })

    message.success ? console.log(message) : console.error(message)
  }
  appendModal() {
    return new Promise((resolve, reject) => {
      let modalDiv = `<div id="myfolderModal" class="ext-modal">
                      <div class="ext-modal-content">
                        <header class="ext-modal-header"> 
                          <span class="ext-close">&times;</span> 
                          <h3>Folder Name</h3>
                        </header>
                        <div id="pagerows">
                            <div class="inp-row">
                              <textarea id="foldername">${this.postTitle} - ${this.threadID}</textarea>
                            </div>
                              <div class="inp-row" style="align-items: flex-start">
                                <div class="ext-radio">
                                  <input id="direct" value="direct" name="mode" class="down-mode" type="radio" >
                                  <label for="direct" class="ext-radio-label">Direct</label>
                                </div>
                              <div class="ext-radio">
                                <input id="aria2" value="aria2" name="mode" class="down-mode" type="radio" checked>
                                <label  for="aria2" class="ext-radio-label">aria2 file</label>
                              </div>
                            </div>
                            <div class="inp-row">
                             <button id="ext-getlinks" class="ext-btn">Download</button>
                            </div>
                        </div>
                      </div>
                    </div>`

      if ($('body').find('#myfolderModal').length == 0) {
        $('body').append(modalDiv)
        $('#myfolderModal').css('display', 'block')
      } else {
        $('#myfolderModal').css('display', 'block')
      }
      resolve()
    })
  }
  modalEvents() {
    $('.ext-close').on('click', (e) => {
      $('#myfolderModal').remove()
    })
    $('#ext-getlinks').on('click', (e) => {
      
      if ($('input[name=mode]:checked').val() === 'aria2') {
        let dirOut = `${this.postTitle} - ${this.threadID}`
        console.log(dirOut) 
        this.createAria2Array(dirOut)
        this.downloadAria()
      } else {
        this.downloadFiles()
      }
    })
  }
}
