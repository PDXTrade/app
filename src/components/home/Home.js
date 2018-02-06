import Template from '../Template';
import html from './home.html';
import Items from '../items/Items';

const template = new Template(html);

export default class Home {

  render() { 
    const dom = template.clone();
    dom.querySelector('.home-view').appendChild(new Items().render());


    return dom; 
  }

  unrender() {
  }
}