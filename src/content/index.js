import RedditManager from './sites/Reddit'
import WaifuistManager from './sites/Waifuist'
import _4chanManager from './sites/4chan'
import ArchivedMoe from './sites/Archived.Moe'
import ChanArchive from './sites/ChanArchive'
import _4Archive from './sites/4Archive'
import Twitter from './sites/Twitter'
import AnonIb from './sites/AnonIb'
import ImgSrcRu from './sites/ImgSrcRu'
export default class AppLauncher {
  constructor() {
    this.init();
    this.domain
  }
  init() {
    this.getDomain()
    console.log(this.domain) 
    switch (true) {
      case this.domain == "v.redd.it":
      case this.domain === "www.reddit.com":
        new RedditManager();
        break;
      case this.domain == "waifuist.pro":
        new WaifuistManager(this.domain);
        break;
      case this.domain.includes("4chan.org") ||
        this.domain.includes("4channel.org"):
        {
          new _4chanManager();
        }
        break;
      case this.domain == "4archive.org":
        {
          new _4Archive();
        }
        break;
      case this.domain == "archived.moe":
      case this.domain == "archive.wakarimasen.moe":
      case this.domain == "thebarchive.com":
      case this.domain == "www.thebarchive.com":
        {
          new ChanArchive(this.domain);
        }
        break;
      case this.domain === "twitter.com":
        Twitter();
        break;
      case this.domain === "imgsrc.ru":
        new ImgSrcRu();
        break;
      case this.domain === "anonib.al" || this.domain === "anonib.pk":
      case this.domain === "wikieat.club":
        new AnonIb();
        break;
      default:
        console.log("other");
    }
  }
  getDomain() {
    this.domain = window.location.hostname;    
  }
  initReddit() {
    this.reddit = new RedditManager()
  }
  initWaifuist() {
    this.waifuist = new WaifuistManager()
  }
  init4chan() {
     this._4chan = new _4chanManager()
  }
  initArchivedMoe() {
    this.archived = new ArchivedMoe()
  }
}

// eslint-disable-next-line no-unused-vars
let launcher = new AppLauncher()