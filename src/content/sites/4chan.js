import $ from "jquery";
import { convertToValidFilename } from "../../utils";
import ChanDownlaoder  from "./Chan";
export default class _4chanManager extends ChanDownlaoder {
  constructor() {
    super()
    // this.removeHat();
    // this.removeIframe();    
    this.title = "";
    this.threadNum = "";
    this.addButton();
    this.addListener();
    $(".thread").on("DOMNodeInserted", (event) => {
      if ($(event.target).attr("class") === "postMessage") 
        this.addButton();
        this.getAllFiles();
    });
    console.log(window.location.pathname)

    this.parseThread();
  }
  removeHat() {
    $(".party-hat").each((o, e) => {
      e.remove();
    });
    $("#js-snowfield").remove();
  }
  removeIframe() {
    $("iframe").remove();
  }
  parseThread() {
    let titleText = $(".opContainer").find(".post .postInfo .subject").text();
    if (titleText === "")
      titleText = $(".opContainer")
        .find(" .post .postMessage")
        .text()
        .slice(0, 50);
    if (titleText === "") titleText = "4chan";
    this.threadNum = $("[name='resto']").val();
    this.postTitle = titleText + " - " + this.threadNum;
    this.getAllFiles();
  }
  addButton() {
    const fileText = $(".postContainer").find(".fileText");
    fileText.find(".d2").remove();

    fileText[0].innerHTML +=
      '<button class="skButton d2" id="getAria" type="button">aria2c</button> <button class="skButton d2" id="downloadAll" type="button">Download All</button>';

    fileText.find(".d1").remove();

    $(".postContainer .fileText:not(:first)").append(
      '<button class="skButton d1" id="downloadPost" type="button">Download</button>'
    );
  }
  addListener() {
    $(document).on("click", "#downloadPost", (e) => {
        e.preventDefault();        
        const file = $(e.target).closest(".file")[0];
        this.getData(file);
      });

    $(document).on("click", "#downloadAll", (e) => {
        e.preventDefault();
        this.downladAll();
      });

    $(document).on("click", "#getAria", async (e) => {
      console.log("hell")
      e.preventDefault();      
      let txtstr = "";
      for (let i = 0; i < this.downloadArray.length; i++) {
        let val = this.downloadArray[i];
        txtstr += `${val.link}\n\tout=${val.name} \n\tdir=${this.postTitle}\n`;
      } 

     let message = await this.sendMessage({
       message: "getAria",
       links: txtstr,
       threadID: this.threadNum
     });
      message.success ? console.log(message) : console.error(message);     
    
    });
  }
  getAllFiles() {
    this.downloadArray = [];
    const postList = $(".thread .postContainer");
    let ext;
    postList.each((o, el) => {
      const fileAnchor = $(el).find(".file .fileText").find("a");
      let link = fileAnchor.attr("href");

      if (link === undefined) return;

      link = "https:" + link;
      ext = link.split(".").pop();

      let fileName = fileAnchor.attr("title");
    
      if (fileName === undefined || fileName === "") {
        fileName = fileAnchor.text();
      }
      fileName = fileName.split(".").shift();  
      let name = convertToValidFilename(fileName) + "." + ext;
      
      this.downloadArray.push({ link: link, name: name });
    });
  }
 
  async getData(el) {
    // console.log(el);
    let link = $(el).find(".fileText").find("a").attr("href");
    link = "https:" + link;
    let text = $(el).find(".fileText").find("a").attr("title");
    if (text == undefined || text === "") {
      text = $(el).find(".fileText").find("a").text();
    }
    let ext = link.split(".").pop();
    let name = convertToValidFilename(text) + "." + ext;
    name = name.replace(/\.[^/.]+$/, "");
    
    let message = await this.sendMessage({
       message: "downloadFile",
       link: link,
       name: name
     });
    message.success ? console.log(message) : console.error(message);
  }

  async downladAll() {
    const newArr = this.downloadArray.map((val) => {
      return {
        filename: `4chan-download/${this.postTitle}/${val.name}`,
        link: val.link
      };
    });
 
    let message = await this.sendMessage({
      message: "downloadBulk",
      linksArray: newArr
    });

    message.success ? console.log(message) : console.error(message);
  }
  
  // Could be useful

  //   new MutationObserver((ms) =>
  //   ms.forEach((m) =>
  //     m.addedNodes.forEach((node) => {
  //       let article =
  //         (node.tagName == "ARTICLE" && node) ||
  //         (node.tagName == "DIV" &&
  //           (node.querySelector("article") || node.closest("article")));
  //       if (article && !article.dataset.injected) TMD.inject(article);
  //     })
  //   )
  // ).observe(document.body, { childList: true, subtree: true });
}
