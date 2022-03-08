import $ from 'jquery'
import '../content.css'
import { convertToValidFilename } from '../utils'

export default class Waifuist {
  constructor() {
    this.init()
    this.post
    this.url
    this.sub
    this.domain
    this.ext
    this.title
    this.parts
    this.folderName = ''
    this.threadList
    this.threadNum
    this.threadName
    this.mode
    this.links = []
  }
  init() {
    this.setMenu()
  }

  setMenu() {
    const titlepane = $('.opHead')
    let thread = $('#threadList')
    this.threadNum = $('#threadList').find('.opCell')[0].id
    this.threadName = convertToValidFilename(document.title)
    // console.log('name', this.threadName)
    const Button = `<button id='imgDownload' class="ext-btn">Download</button>`
    titlepane.append(Button)

    $('#imgDownload').on('click', (e) => {
      e.preventDefault()
      this.downloadImages(thread)
    })
  }

  downloadImages(thread) {
    let imageJson
    this.threadList = $(thread).find('.uploadCell').find('.uploadDetails')

    this.appendModal()
      .then(() => {
        this.addModalEvents()
      })
      .then(() => (this.title = document.title))
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
                              <textarea id="foldername"></textarea>
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

  addModalEvents() {
    let modal = $('#myfolderModal')
    let span = $('.ext-close')[0]
    $(span).on('click', (e) => {
      $(modal).css('display', 'none')
    })
    $('#ext-getlinks').on('click', (e) => {
      this.folderName = $('#foldername').val()
      this.mode = $('input[name="mode"]:checked').val()

      this.getImages().then(this.makeArray())
    })
  }

  getImages() {
    return new Promise((resolve, reject) => {
      let o = this.threadList.find('.originalNameLink')

      let la = []

      Array.from(o).forEach((el, n) => {
        let m = {}
        m['link'] = $(el).prop('href')
        m['name'] = $(el).attr('download')
        // console.log(m)
        la.push(m)
      })
      this.links = la

      resolve()
    })
  }

  makeArray() {
    if (this.mode == 'aria2') {
      let txtstr = ''
      this.links.forEach((i, o) => {
        let fname = convertToValidFilename(i.name)
        let dirOut = 'C:/Users/BSK/Downloads/' + this.threadName
        console.log(i)
        txtstr += `${i.link}\n\tout=${fname} \n\tdir=${dirOut}\n`
      })

      let href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txtstr)
      let dname = this.threadNum + '.txt'

      chrome.runtime.sendMessage(
        { message: 'downloadFile', link: href, name: dname },
        function (response) {
          console.log({ response })
        }
      )
    }
  }
}
