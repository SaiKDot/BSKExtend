import RedditManager from './Reddit'
import WaifuistManager from './Waifuist'

let domain
export default class AppLauncher {
  constructor() {
    this.init();
  }
  init() {
    this.getDomain();
    switch (domain) {
      case "www.reddit.com":
        this.initReddit()
        break;
      case "waifuist.pro":
        this.initWaifuist()
      default:
        console.log("other")
    }
  }
  getDomain() {
    domain = window.location.hostname;
    console.log({ domain })
  }
  initReddit() {
    this.reddit = new RedditManager()
  }
  initWaifuist() {
    this.waifuist = new WaifuistManager()
  }
}

let launcher = new AppLauncher()