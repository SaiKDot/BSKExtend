import ChanDownloader from './Chan'
import $ from 'jquery'

export default class Barchive extends ChanDownloader {
  constructor() {
    super()
    this.appendButton()
    // this.getLinks()
    // this.revealModalEvent()
    // this.downloadFiles()
  }
  appendButton() {
    $('header > .post_data').first().append(this.dirDwn)
  }
}
