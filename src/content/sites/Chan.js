import {convertToValidFilename} from '../../utils'
import $ from 'jquery'
export default class ChanDownlaoder {
  constructor() {
    
    this.dirDwn =
      '<button class="mtButton" id="dwnaria"> Download Aria</button> <button class="mtButton" id="drDwn">Download Images</button> ';
    this.dirSpan =
      '<span class="mtButton" id="dwnaria"> Download Aria</span> <span class="mtButton" id="drDwn">Download Images</span> ';
    this.postTitle
    this.threadID 
    this.downloadArray = []
    this.dirOut 
    this.txtstr = ""
    this.keys = {};
 
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

 

  async downloadAria() { 
    
    
   return new Promise( (resolve, reject) => {
     let message = this.sendMessage({
       message: "getAria",
       links: this.txtstr,
       threadID: this.threadID
     });

     message.success ? resolve(message) : reject(message);
   });
    
    
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

