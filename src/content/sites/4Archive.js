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
    let postInfo = $(".postInfo").find(".subject").text();
    postInfo = postInfo
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s*$/, "")
      .trim();
    console.log({ postInfo });
    let postMessage = $('.postMessage').first().text()
    console.log({ postMessage });
    postMessage = postMessage
      .split(" ")
      .slice(0, 6)
      .join(" ")
      .trim()
      .replace(/[^a-z0-9\s]/gi, "");
    postMessage = postMessage.replace(/\n/g, " ");
    postMessage = postMessage.replace("br", " ");

    this.postTitle =
      postInfo == "" || postInfo == null ? postMessage : postInfo;
    this.threadID = $('.thread').first().attr('id').replace('t', '')  
     
    const postList = $(".postContainer").find(".fileText").find("a:first");
    
    postList.each((i, o) => {
      let linkName = o.text;
      let title = o.title;
      let link = o.href;

      title = title.replace("Full size of ", "");
      let fileName;

      const ext = link.split(".").pop();
       fileName = fileName.split(".").shift();
      //  let name = convertToValidFilename(fileName) + "." + ext;

      if (title == null || title == "" || title == undefined) {
        fileName = linkName.substring(linkName.lastIndexOf("/") + 1);
      } else {
        fileName = title;
      }
    
      this.downloadArray.push({
        title: fileName,
        link: link
      });
    });
     
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

