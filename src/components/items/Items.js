import Template from '../Template';
import html from './items.html';
import ItemList from './list/ItemList';
import AddItem from './add/AddItem';
// import { db } from '../../../services/firebase';
// import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);
// const categories = db.ref('categories');

export default class Items {
  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

    let childComponent; //how to add list of stuff from db?
    if(childPage) {
      childComponent = new ItemList(childPage);
      this.header.textContent = `${childPage}`;
    } else {
      childComponent = new ItemList();
      this.header.textContent = `All Items`;
      
    }

    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());
  }

  render() { 
    const dom = template.clone();
    this.section = dom.querySelector('section');
    this.header = dom.querySelector('#item-list-header');
    this.setChildPage();
    this.section.appendChild(AddItem.render());

    return dom; 
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}