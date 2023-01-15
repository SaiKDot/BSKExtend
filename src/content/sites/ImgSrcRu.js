import $ from 'jquery'
import ChanDownlaoder from './Chan';
import { convertToValidFilename } from '../../utils';

export default class ImgSrcRu extends ChanDownlaoder {
  constructor() {
     super();
    this.addButton();
    this.addListener();
    this.title = "";
    this.downloadArray = [];
    this.getAllImages();
  }
  addButton() {
    if ($(".download-sk").length === 0)
      $('<button class="download-sk" type="button">download</button>').appendTo(
        " .header-title"
      );
  }
  addListener() {
    $(document).on("click", ".download-sk", (e) => {
      e.preventDefault();
      this.downloadImages();
    });
  }
  getAllImages() {
    this.title = $(".header").find("h1").text();
    if (this.title === "") this.title = $(".header").find("tomato").text();
    this.title = this.title + " - " + "imgSrcRu";

    const pics = $("picture");

    $.each(pics, (i, val) => {
      let imgLink = "";
      imgLink = $(val).find("img.fts").attr("src");
      if (imgLink === "") {
        imgLink = $(val).find("source")[0].attr("srcset");
      }
      if (imgLink != "") imgLink = "https:" + imgLink;

      const parentAcnch = $(val).closest("a");
      let fileName = $(parentAcnch).next().text();
      fileName = convertToValidFilename(fileName);
      if (fileName !== "https:")
        this.downloadArray.push({
          filename: `${this.title}/${fileName}`,
          link: imgLink
        });
    });
  }
  async downloadImages() {
    let message = await this.sendMessage({
      message: "downloadBulk",
      linksArray: this.downloadArray
    });

    message.success ? console.log(message) : console.error(message);
  }
}