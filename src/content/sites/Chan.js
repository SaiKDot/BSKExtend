import {convertToValidFilename} from '../../utils'
import $ from 'jquery'
export default class ChanDownlaoder {
  constructor() {
    // this.array = array
    this.dirDwn =
      '<button class="skButton" id="dwnaria"> Download Aria</button> <button class="skButton" id="drDwn">Download Images</button> '
    this.dirSpan = '<span class="skButton" id="dwnaria"> Download Aria</span> <span class="skButton" id="drDwn">Download Images</span> '
    this.postTitle
    this.threadID 
    this.downloadArray = []
    this.dirOut
    this.txtstr = ''
    // this.appendLocationModal() //remove the function
    // this.removeEvent() //remove the function
    // this.downloadAriaEvent()
  }
  createAria2Array() {
    $.each(this.downloadArray, (i, val) => {     
      let title = convertToValidFilename(val.title)
      this.txtstr += `${val.link}\n\tout=${title} \n\tdir=${this.postTitle} - ${this.threadID}\n`
    })   
    
  }
  appendLocationModal() {
    let modalDiv = `<div id="myfolderModal" class="ext-modal">
                      <div class="ext-modal-content">
                        <header class="ext-modal-header"> 
                          <span class="ext-close">&times;</span> 
                          <h3>Folder Name</h3>
                        </header>
                        <div id="pagerows">
                            <div class="inp-row">
                              <textarea id="foldername"> </textarea>
                            </div>                              
                          <div class="inp-row">
                             <button id="ext-getlinks" class="ext-btn">Download</button>
                          </dv>
                        </div>
                      </div>
                    </div>`

    if ($('body').find('#myfolderMfoldernameodal').length == 0) {
      $('body').append(modalDiv)
      $('#myfolderModal').css('display', 'none')
    } else {
      $('#myfolderModal').css('display', 'none')
    }
  }
 

  revealModal() {
    $('#myfolderModal').css('display', 'block')
  }

  // removeEvent() {
  //   const close = $('.ext-close')[0]
  //   $(close).on('click', function (e) {
  //     const modal = $('.ext-modal').first()
  //     $(modal).css('display', 'none')
  //   })
  // }

  async downloadAria() {   
     let message = await this.sendMessage({
       message: "getAria",
       links: this.txtstr,
       threadID: this.threadID
     });
     
    message.success ? console.log(message) : console.error(message)
  }


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

