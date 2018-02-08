import Template from '../Template';
import html from './items.html';
import ItemList from './list/ItemList';
import AddItem from './add/AddItem';
import { db, auth } from '../../services/firebase';
import { removeChildren } from '../dom';
import ItemDetail from './itemDetail/ItemDetail';

const template = new Template(html);
const toys = db.ref('items').orderByChild('category').equalTo('Toys');
const electronics = db.ref('items').orderByChild('category').equalTo('Electronics');
const pets = db.ref('items').orderByChild('category').equalTo('Pets');
const vehicles = db.ref('items').orderByChild('category').equalTo('Vehicles');

export default class Items {
  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

    if(this.childComponent && this.childComponent.unrender) {
      this.childComponent.unrender();
    }
    let childComponent;
    if(childPage === 'Vehicles') {
      childComponent = new ItemList(vehicles);
      this.header.textContent = `${childPage}`;
    } else if(childPage === 'Toys') {
      childComponent = new ItemList(toys);
      this.header.textContent = `${childPage}`;
    } else if(childPage === 'Pets') {
      childComponent = new ItemList(pets);
      this.header.textContent = `${childPage}`;
    } else if(childPage === 'Electronics') {
      childComponent = new ItemList(electronics);
      this.header.textContent = `${childPage}`;
    } else if(childPage === 'addItem') {
      if(auth.currentUser) { //prevents no user from seeing add item
        childComponent = new AddItem();
        this.header.textContent = 'New Item';
        this.paragraph.textContent = 'Create a new item to trade';
      } else {
        return window.location.hash = `#login/${encodeURIComponent('#items/addItem')}`;
      }
    } else if(childPage === 'item') {
      childComponent = new ItemDetail(routes[2]); //selects key from route split
      this.header.textContent = '';
      this.paragraph.textContent = '';
    } else {
      childComponent = new ItemList();
      this.header.textContent = 'All Items';
    }
    removeChildren(this.section);
    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());

  }

  render() { 
    const dom = template.clone();
    this.section = dom.querySelector('section');
    this.header = dom.querySelector('#item-list-header');
    this.paragraph = dom.querySelector('p');
    this.setChildPage();

    return dom; 

  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}