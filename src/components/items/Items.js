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
const user = auth.currentUser;

// const map = new Map();
// map.set('#items/addItem', { Component: AddItem, isPublic: false });

// const homepage = { Component: Items, isPublic: true };

export default class Items {
  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);

    // let authed = false;

    // auth.onAuthStateChanged(user => {
    //   this.user = user;
    //   if(!authed) {
    //     authed = true;
    //     this.setChildPage();
    //   }
    //   if(!user && !this.page.isPublic) {
    //     window.location.hash = '#';
    //   }
    // });
  }

  setChildPage() { //TODO, limit authorization on new item page
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

    // if(this.page && this.page.component) this.page.component.unrender();
    // removeChildren(this.section);

    // const { Component, isPublic } = map.get(childPage) || homepage;

    // let component = null;

    // if(!isPublic && !this.user) {
    //   window.location.hash = `#login/${encodedURIComponent(hash)}`;
    // }

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
      if(user) {
        childComponent = new AddItem();
        this.header.textContent = 'New Item';
        this.paragraph.textContent = 'Create a new item to trade';
      } else {
        window.location.hash = 'login';
      }
    } else if(childPage === 'item') {
      childComponent = new ItemDetail(routes[2]); //selects key from route split
      this.header.textContent = '';
      this.paragraph.textContent = '';
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