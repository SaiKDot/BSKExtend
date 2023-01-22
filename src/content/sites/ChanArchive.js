import ChanDownloader  from './Chan'
import $ from 'jquery'
export default class ChanArchive extends ChanDownloader {
  constructor(domain) {
    super()
    this.appendButton(); 
    this.addEvents();
    this.domain = domain
    this.getLinks()
    this.postTitle;
    // this.revealModalEvent() //remove the function
    // this.downloadFiles()
 
  }
  appendButton() {
    $('header > .post_data').first().append(this.dirDwn)
  }
  addEvents() {
    $(document).on("click", "#dwnaria",() => {
      let dirOut = `${this.postTitle} - ${this.threadID}`;
      console.log(dirOut);
      this.createAria2Array(dirOut);
      this.downloadAria();
    });
  }
  getLinks() {
    const article = $('article.thread:first')[0]
    this.threadID = $(article).data('thread-num')
    let h2t = $(article).find('.post_title').text()
    h2t = h2t
          .replace(/[^a-z0-9\s]/gi, '')
          .replace(/\s*$/, '')
          .trim()
     var xf = $('.text').first().text()
     var snt = xf
       .split(' ')
       .slice(0, 6)
       .join(' ')
       .trim()
       .replace(/[^a-z0-9\s]/gi, '')

    this.postTitle = h2t == '' || h2t == null || typeof h2t === "undefined" ? snt : h2t
    
    const links = $(article).find('.post_file_filename')

    links.each((i, o) => {
      let fi_con, link
      fi_con = $(o).closest('.post_file').find('.post_file_controls')

      if (fi_con.length == 0) {
        fi_con = $(o).closest('.post_file').siblings('.post_file_controls')
      }

      if (this.domain != 'archived.moe') {
        const url_A = fi_con.find('a:last')[0]
        link = $(url_A).attr('href')
      } else {
        link = this.archivedMoeLinks(fi_con, i)
      }

      let lname = o.text
      let fname = o.title
      let title
      if (fname == null || fname == '' || typeof fname == "undefined") {
        title = lname.substring(lname.lastIndexOf('/') + 1)
        
      } else {
        title = fname
        
      }
      this.downloadArray.push({ title, link })
    })
     
  }
  
   
 

  archivedMoeLinks(fi_con, i) {
    let a
    if (i == 0) {
      a = fi_con.siblings('.post_file').find('.post_file_filename')
    } else {
      a = fi_con.siblings('.post_file_filename')
    }
    return $(a).attr('href')
    // console.log($(a).attr('href'))
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
    console.log(this.downloadArray);

  }
}
