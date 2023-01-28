import * as cheerio from "cheerio";
import $ from "jquery";
// import { convertToValidFilename } from '../utils'

export default class EventTasks {
  constructor() {
    this.init();
    this.fileName = "";
    this.url;
    this.audioFname;
    this.videoFname;
    this.ImgurApiEndpoint = "https://api.imgur.com/3/";
    this.ImgurclientID = "ff21f6fc51cefd4";
    this.ImgurClientSecret = "1171169fafb675ad10775c312482dcc11d85b14f";
  }
  init() {
    chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
      console.log(item);
      suggest({
        filename: this.fileName,
        conflictAction: "uniquify"
      });
    });
    chrome.runtime.onInstalled.addListener(() => {
      chrome.storage.local.set({
        name: "BSK"
      });
    });
    chrome.storage.local.get("name", (data) => {
      console.log(data);
    });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request.message);
      switch (request.message) {
        case "downloadFile":
          {
            console.log(request);
            this.url = request.link;
            this.fileName = request.name;
            this.downloadFile();
            sendResponse({ success: true, response: "downloaded!" });
          }
          break;
        case "downloadBulk":
          {
            // let links = []
            // this.fileName =  request.name
            // links.push(...request.links)

            const { linksArray } = request;
            console.log({ linksArray });

            this.downloadSequentially(linksArray);
            sendResponse({ success: true, response: "downloaded!" });
          }
          break;

        case "loadImgurPage":
          {
            this.url = request.link;
            console.log(request.link);
            fetch(this.url)
              .then(async (body) => {
                let res = await body.json();
                sendResponse({ success: true, response: res });
              })
              .catch(() => {
                sendResponse({ success: false, response: "unable to fetch" });
              });
          }
          break;
        case "loadGiphyPage":
          {
            this.url = request.link;
            this.fileName = request.title;
            console.log(request.title);
            var self = this;
            fetch(this.url)
              .then(async (response) => {
                return response.text();
              })
              .then((responseText) => {
                const $ = cheerio.load(responseText);
                $("meta").each(function (i, e) {
                  if ($(e).attr("property") == "og:video:secure_url") {
                    let url = $(e).attr("content");
                    url = url.replace("media4", "i");
                    const stringArray = url.split("?");
                    self.url = stringArray[0];
                    self.downloadFile();
                  }
                });
              });
          }
          break;
        case "loadPage":
          {
            const url = request.link;
            fetch(url)
              .then(async (body) => {
                let res = await body.text();
                sendResponse({ success: true, response: res });
              })
              .catch((e) => {
                sendResponse({
                  success: false,
                  response: "unable to fetch" + e
                });
              });
          }
          break;
        case "getAria":
          {
            const { links, threadID } = request;            
            this.url =
              "data:text/plain;charset=utf-8," + encodeURIComponent(links);
            this.fileName = threadID + ".txt";
            this.downloadFile();
            sendResponse({ success: true, response: "Aria File downloaded!" });
          }
          break;
        case "ariaDownload":
          {
            const { links, postTitle } = request;
            console.log(postTitle)

            var port = chrome.runtime.connectNative("mybat.application");
            port.postMessage({ txtStr: links, filename: "some message" });
            port.onMessage.addListener(function (msg) {
              console.log("Received" + msg);
            });
            port.onDisconnect.addListener(function () {
              console.log("Disconnected" + chrome.runtime.lastError.message);
            });
          }
          break;
        default:
          return true;
      }
      return true;
    });
  }
  async getRedditVid(gurl, fname) {
    let vidUrl, audioUrl;
    fetch(gurl)
      .then((response) => {
        return response.json();
      })
      .then((resp) => {
        console.log(resp);
        var fallback_url =
          resp[0].data.children[0].data.secure_media.reddit_video.fallback_url;
        if (fallback_url) {
          vidUrl = fallback_url;
          fname = this.videoFname = fname.replace(".mp4", "-video.mp4");
          this.fileName = fname;
          this.url = vidUrl;
          console.log({ vidUrl });
          // this.downloadFile()
          let mediaUrl = fallback_url.split("https://v.redd.it/")[1];
          console.log({ mediaUrl });
          // let mediaId = mediaUrl.split("/")[0]; use later don't delete yet
          fname = fname.replace("-video.mp4", "-audio.mp4a");
          this.fileName = this.audioFname = fname;
          let aurl = vidUrl.split("DASH_480.mp4")[0];
          console.log(aurl);
          audioUrl = aurl + "DASH_audio.mp4";
          this.url = audioUrl;
          // this.downloadFile()
          this.generateBatFile();
          this.downloadFile();
        }
      })
      .then(() => {});
  }

  downloadFile() {
    chrome.downloads.download({
      url: this.url,
      conflictAction: "uniquify",
      saveAs: false
    });
  }

  generateBatFile() {
    let batchStr = [
      "@echo off",
      "setlocal enabledelayedexpansion",
      "chcp 65001",
      "ffmpeg -version",
      "if errorlevel 1 (",
      '  echo "ffmpeg not found"',
      "  @pause",
      "  exit",
      ")",
      'SET "filename=' + this.videoFname + '"',
      'echo "filename: %filename%"',
      'echo "cd: %cd%"',
      "dir",
      "@pause",
      "(FOR /R %%i IN (*.ts) DO @echo file 's/%%~nxi') > list.txt",
      'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "%filename%.mp3"',
      'del "list.txt"',
      'echo "success"',
      "@pause"
    ]
      .join("\r\n")
      .toString();

    // let url =
    //   'data:text/plain;base64,' +
    //   '@echo off'
    //   ;

    let url = "data:text/plain;base64," + batchStr;
    console.log({ url });
    this.url = url;
    let filename = this.videoFname.replace(".mp4", ".bat");
    this.fileName = filename;
    console.log("fname", this.fileName);
  }
  getForum(gurl) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", gurl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var resp = xhr.responseText;
          let body = $("video.video").html();
          resolve(body);
        } else {
          console.log(resp);
          reject();
        }
      };
    });
  }
  async downloadSequentially(urls) {
    console.log("downloadSe")
    for (const url of urls) {
      if (!url) continue;
      const currentId = await this.download(url.link);
      this.fileName = url.filename;
      // eslint-disable-next-line no-unused-vars
      const success = await this.onDownloadComplete(currentId);
    }
    return;
  }

  download(url) {
    console.log(url)
    return new Promise((resolve) =>
      chrome.downloads.download({ url }, resolve)
    );
  }
  onDownloadComplete(itemId) {
    return new Promise((resolve) => {
      chrome.downloads.onChanged.addListener(function onChanged({ id, state }) {
        if (id === itemId && state && state.current !== "in_progress") {
          chrome.downloads.onChanged.removeListener(onChanged);
          resolve(state.current === "complete");
        }
      });
    });
  }
  // scrapeVid() {
  //    proc.addInput(`https://v.redd.it/${mediaId}/DASH_${res}`)
  //   .output(`${outputFolder}${mediaId}-${res}.mp4`)
  //   .on("error", err => {
  //     console.log("Error: " + err);
  //   })
  //   .on("end", () => {
  //     console.log("Done");
  //   });
  // }
}

// eslint-disable-next-line no-unused-vars
let eventTasks = new EventTasks();
