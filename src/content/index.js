import RedditManager from './Reddit'
import WaifuistManager from './Waifuist'
import _4chanManager from './4chan'
import ArchivedMoe from './Archived.Moe'
import ChanArchive from './ChanArchive'
import _4Archive from './4Archive'
import Twitter from './Twitter'
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
				this.domain.includes("4channel.org"): {
					new _4chanManager();
				}
				break;
			case this.domain == "4archive.org": {
					new _4Archive();
				}
				break;
			case this.domain == "archived.moe":
			case this.domain == "archive.wakarimasen.moe":
			case this.domain == "thebarchive.com":{
					new ChanArchive(this.domain);
			}
			break;
			case this.domain === "twitter.com" : Twitter()
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

let launcher = new AppLauncher()