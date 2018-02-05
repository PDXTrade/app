import html from './footer.html';
import Template from '../../Template';
import './footer.css';
import { removeChildren } from '../../dom';

export default class Footer {
  constructor(cb) {
    window.onhashchange () => {
      this.setButton();
    }
    this.cb = cb;
  }

  setButton() => {
    if(window.location.hash === "new") {

    }
  }

  render() {
    const dom = template.clone();
    this.button = dom.querySelector('#footer-button');

    this.setButton();

    return dom;
  }
}