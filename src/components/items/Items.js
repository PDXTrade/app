import Template from '../Template';
import html from './items.html';
import ItemList from './list/ItemList';
import AddItem from './add/AddItem';
import { db } from '../../services/firebase';
import ItemDetail from './itemDetail/ItemDetail';

const template = new Template(html);
const vehicles = db.ref('Vehicles');
const electronics = db.ref('Electronics');
const toys = db.ref('Toys');
const pets = db.ref('Pets');

export default class Items {
  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

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
      childComponent = new AddItem();
      this.header.textContent = 'New Item';
      this.paragraph.textContent = 'Create a new item to trade';
    } else if(childPage === 'Item') {
      childComponent = new ItemDetail(routes[2]); //selects key from route split
      this.header.textContent = 'New Item';
      this.paragraph.textContent = 'Create a new item to trade';
    } else {
      childComponent = new ItemList();
      this.header.textContent = 'All Items';
    }

    this.section.textContent = '';
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