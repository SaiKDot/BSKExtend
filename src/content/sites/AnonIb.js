import $ from "jquery";
import { convertToValidFilename } from "../../utils";
export default class AnonIb {
  constructor() {
    this.addButton();
    this.addListener();
    this.postTitle = "anonib thread";
    this.threadNum = "";
    this.fileString = "";
    this.downloadArray = [];
  }

  addButton() {
    if ($(".aria2").length == 0)
      $(
        '<button class="skButton aria2" type="button">aria2c</button>'
      ).appendTo(" .opHead");
    if ($(".down-sync").length == 0)
      $(
        '<button class="skButton down-sync" type="button">Download</button>'
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

    this.postTitle = `${this.postTitle} - anonib cel - ${this.threadNum}`;

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
  createTextString() {
    let txtstr = "";
    $.each(this.downloadArray, (i, val) => {
      txtstr += `${val.link}\n\tout=${val.name} \n\tdir=${this.postTitle}\n`;
    });

    chrome.runtime.sendMessage(
      {
        message: "getAria",
        links: txtstr,
        threadID: this.threadNum
      },
      (response) => {
        if (response.success) {
          console.log(response);
        } else {
          console.log(response, "Error");
        }
      }
    );
  }
  async downladAll(){
    const newArr = this.downloadArray.map((val)=> {return { filename: `anon-ib/${this.postTitle}/${val.name}`, url: val.link }})
       let message = await this.sendMessage({
         message: "downloadBulk",
         linksArray: newArr
       });

       message.success ? console.log(message) : console.error(message);
  }
   
}
