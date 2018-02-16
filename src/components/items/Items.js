import Template from '../Template';
import './items.css';
import html from './items.html';
import ItemList from './list/ItemList';
import AddItem from './add/AddItem';
import ItemDetail from './itemDetail/ItemDetail';
import { db, auth } from '../../services/firebase';
import { removeChildren } from '../dom';

const template = new Template(html);
// DRY!
const orderByCategory = db.ref('items').orderByChild('category');
// Use a map
const categoryQueries = {
  Toys: orderByCategory.equalTo('Toys'),
  Electronics: orderByCategory.equalTo('Electronics'),
  Pets: orderByCategory.equalTo('Pets'),
  Vehicles: orderByCategory.equalTo('Vehicles')
};

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
    let headerText = '';
    let paragraphText = '';

    const query = categoryQueries[childPage];

    if(query) {
      childComponent = new ItemList(query);
      headerText = `${childPage}`;
      paragraphText = `Items in the ${childPage.toLowerCase()} category`;
    }
    else if(childPage === 'addItem') {
      // Use a guard clause to reduce nesting
      if(!auth.currentUser) { //prevents no user from seeing add item
        return window.location.hash = `#login/${encodeURIComponent('#items/addItem')}`;
      }
      childComponent = new AddItem();
      headerText = 'New Item';
      paragraphText = 'Create a new item to trade';
    } 
    else if(childPage === 'item') {
      childComponent = new ItemDetail(routes[2]); //selects key from route split
    } 
    else {
      childComponent = new ItemList();
      headerText = 'All Items';
    }

    this.header.textContent = headerText;
    this.paragraph.textContent = paragraphText;

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