import $ from 'jquery'

export default class ArchivedMoe {
  constructor() {
    this.links = []
    this.addButton()
    this.domains = {
      an: 'https://desu-usergeneratedcontent.xyz/',
      default: 'https://thebarchive.com/data/',
      b: 'https://thebarchive.com/data/',
    }
    this.desu = ['an', 'fit']
    this.board
    this.link
    this.title 
    this.ext
  }
  addButton() {
    const button = $(`<button class="download_post">Download </button>`)
    this.fileNameEl = $('.post_file').find('a.post_file_filename')
    
    // $('.post_file_controls').append(button)

    $('.post_file').append(button)
    this.addButtonEvent(this.fileNameEl)
    // this.addLinks(this.fileNameEl)
  }
  addLinks(fileNameEl) {
    Array.from(fileNameEl).forEach((element) => {
      const link = $(element).attr('href')
      let title = $(element).attr('title')

      if (title === '' || title == undefined) {
        title = $(element).text()
      }
      this.links.push({ link, title })
    })
    return
  }
  addButtonEvent() {
    $(document).on('click', '.download_post', (e) => {
      this.getData(e.target)
    })
  }
  getData(butn) {        
     
   
    let thumb = $(butn).closest('.post_wrapper')
                       .find('.post_image')
                       .attr('src')
                       

    let imglnkEL = $(butn).closest('.thread_image_box') 
                        .find('.thread_image_link')
                        // .attr('href')
    if(imglnkEL.length ==0) {
      imglnkEL =  $(butn).closest('.post_wrapper').find('.post_file_filename')
    }
    let imglnk = imglnkEL.attr('title')
    if (imglnk == '') {
      imglnk = imglnkEL.text()
    }
    
    this.ext = imglnk.split('/').pop().split('.').pop()

    this.title = $(butn).closest('.post_file').find('.post_file_filename').text()
   
    
    if (thumb === undefined) {
      thumb = $(butn)
        .closest('.thread_image_box')
        .find('img.post_image')
        .attr('src')
    }

    this.board = this.getBoard(thumb)
    const split = thumb.split('/thumb/')   
    let filelnk = split[1].replace('s.', '.')    
    this.link = this.formLink(split[0], filelnk)
    console.log(this.link, this.title)
    chrome.runtime.sendMessage(
      { message: 'downloadFile', link: this.link, name: this.title },
      (response) => {
        if (response.success) {
          console.log(response)
        } else {
          console.log(response)
        }
      }
    )
    
  }

  getBoard(str) {
   
    str = str.replace('https://', '')
    const split1 = str.split('/')
    return split1[2]
  }

  formLink(part1, part2) {
  
    part2 = part2.substring(0, part2.indexOf('.'))
    part2 = part2 + '.' + this.ext
    part1 = part1.replace('https://archived.moe/files/', (this.domains[this.board]))
    let l = part1 + '/image/' + part2
    return l
    
  }
}


