import $ from "jquery";
import { convertToValidFilename } from "../../utils";
export default class AnonIb {
  constructor() {
    this.downloadArray = [];
    this.postTitle = "anonib thread";
    this.threadNum = "";
    this.fileString = "";
    this.addButton();
    this.addListener();
    this.parseThread();
   
   
  }
  sendMessage(request) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(request, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

  addButton() {
    if ($(".aria2").length == 0)
      $(
        '<button class="mtButton aria2" type="button">aria2c</button>'
      ).appendTo(" .opHead");
    if ($(".down-sync").length == 0)
      $(
        '<button class="mtButton down-sync" type="button">Download</button>'
      ).appendTo(" .opHead");
  }
  addListener() {
    $(document).on("click", ".aria2", (e) => {
      e.preventDefault();
      this.createTextString();
    });
    $(document).on("click", ".down-sync", (e) => {
      e.preventDefault();
      this.downladAll();
    });
  }
  parseThread() {
    this.postTitle = $(".opHead").find(".labelSubject").text();
    if (
      this.postTitle === "anonib thread" ||
      this.postTitle === "" ||
      this.postTitle === undefined
    ) {
      this.postTitle = $(".innerOP").find(".divMessage").text().slice(0, 29);
    }

    this.threadNum = $(".opCell").attr("id");
    if (this.threadNum === "" || this.threadNum === undefined) {
      this.threadNum = $("#threadIdentifier").val();
    }

    this.postTitle = convertToValidFilename(`${this.postTitle} - anonib cel - ${this.threadNum}`);

    const allposts = $("#threadList").find(".uploadCell");
    $.each(allposts, (i, val) => {
      const originalNameLink = $(val).find(".originalNameLink");
      const nameLink = $(val).find(".nameLink");

      let fileName = originalNameLink.text();
      if (fileName === "" || fileName == undefined) fileName = nameLink.text();

      fileName = convertToValidFilename(fileName);

      let fileLink = originalNameLink.attr("href");
      if (fileLink === "" || fileLink == undefined)
        fileLink = $(val).find(".nameLink").attr("href");

      if (!fileLink.startsWith("http://") && !fileLink.startsWith("https://")) {
        fileLink = "https://anonib.al" + fileLink;
      }

      this.downloadArray.push({ link: fileLink, name: fileName });
    });
  }
  async createTextString() {
      let txtstr = "";
      $.each(this.downloadArray, (i, val) => {
        txtstr += `${val.link}\n\tout=${val.name} \n\tdir=${this.postTitle}\n`;
      });
      let message = await this.sendMessage({
        message: "getAria",
        links: txtstr,
        threadID: this.threadNum
      });
      message.success ? console.log(message) : console.error(message);    
  }

  async downladAll() {
    // console.log(this.downloadArray)
    const newArr = this.downloadArray.map((val) => {
      return {
        filename: `anon-ib/${this.postTitle}/${val.name}`,
        link: val.link
      };
    });
    // console.log(newArr)
    let message = await this.sendMessage({
      message: "downloadBulk",
      linksArray: newArr
    });

    message.success ? console.log(message) : console.error(message);
  }
}
