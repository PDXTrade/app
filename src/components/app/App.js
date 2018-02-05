import Template from '../Template';
import html from './app.html';
import './app.css';
import { removeChildren } from '../dom';
import Header from './Header';

const template = new Template(html);

// const map = new Map();
// map.set('#enter', Enter);
// map.set('#about', About);

export default class App {

  // constructor() {
  //   window.onhashchange = () => {
  //     this.setPage();
  //   };
  // }

  // setPage() {
  //   const Component = map.get(window.location.hash) || Enter;
  //   const component = new Component();
  //   removeChildren(this.main);
  //   this.main.appendChild(component.render());
  // }

  render() {
    const dom = template.clone();   

    dom.querySelector('header').appendChild(new Header().render());

    this.footer = dom.querySelector('#footer');
    this.header = dom.querySelector('#header');
    this.main = dom.querySelector('main');
    // this.setPage();

    return dom;
  }
}
