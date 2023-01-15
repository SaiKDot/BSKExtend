import $ from 'jquery'
import { convertToValidFilename } from '../utils'
export default class _4chanManager {
  constructor() {
    this.removeHat();
    this.addButton();
    this.addListener();
    this.removeIframe();
    this.downloadArray = [];
    this.postTitle;
    this.txtstr = "";
  }
  removeHat() {
    $(".party-hat").each((o, e) => {
      e.remove();
    });
    $("#js-snowfield").remove();
  }
  removeIframe(){
    $('iframe').remove();
  }
  addButton() {
    // console.log($(".postContainer").find(".fileText")[0]);
    const fileText = $(".postContainer").find(".fileText");
    fileText.find(".d2").remove();
    console.log(fileText);
    fileText[0].innerHTML +=
      '<button class="skButton d2" type="button">aria2c</button>';

    fileText.find(".d1").remove();
   
    fileText.append(
      '<button class="skButton d1" type="button">download</button>'
    );
  }
  addListener() {
    var self = this;

    $(".thread").on("DOMNodeInserted", (event) => {
      if ($(event.target).attr("class") === "postMessage") self.addButton();
    });

    $(document)
      .off()
      .on("click", ".d1", (e) => {
        e.preventDefault();
        const file = $(e.target).closest(".file")[0];
        this.getData(file);
      });

    $(document)
      .off()
      .on("click", ".d2", (e) => {
        e.preventDefault();
        this.getAllFiles();
        this.postTitle = $(e.target)
          .closest(".post")
          .find(".postInfo .subject")
          .text();
        if (this.postTitle === undefined || this.postTitle === "") {
          this.postTitle = $(e.target)
            .closest(".post")
            .find(".postMessage")
            .text()
            .slice(0, 29);
        }
        this.createTextString();
        chrome.runtime.sendMessage(
          {
            message: "ariaDownload",
            links: this.txtstr
          },
          (response) => {
            if (response.success) {
              console.log(response);
            } else {
            }
          }
        );
      });
  }
  getAllFiles() {
    const postList = $(".thread .postContainer");
    let ext;
    postList.each((o, el) => {
      const fileAnchor = $(el).find(".file .fileText").find("a");
      let link = fileAnchor.attr("href");

      if (link === undefined) return;
      ext = link.split(".").pop();

      let filename = fileAnchor.attr("title");
      if (filename === undefined || filename === "") {
        filename = fileAnchor.text();
      }
      let name = convertToValidFilename(filename) + "." + ext;
      this.downloadArray.push({ link: link, title: name });
    });
  }
  createTextString() {
    $.each(this.downloadArray, (i, val) => {
      let title = convertToValidFilename(val.title);
      this.txtstr += `${val.link}\n\tout=${title} \n\tdir=${this.postTitle} - ${this.threadID}\n`;
    });
  }
  getData(el) {
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
    chrome.runtime.sendMessage(
      { message: "downloadFile", link: link, name: name },
      (response) => {
        if (response.success) {
          console.log(response);
        } else {
        }
      }
    );
  }

  formLink(part1, part2) {
    part2 = part2.substring(0, part2.indexOf("."));
    part2 = part2 + "." + this.ext;
    part1 = part1.replace(
      "https://archived.moe/files/",
      this.domains[this.board]
    );
    let l = part1 + "/image/" + part2;
    return l;
  }
}
