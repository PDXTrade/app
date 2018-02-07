import Template from '../Template';
import html from './user-page.html';
import './user-page.css';
import ItemList from '../items/list/ItemList';

import { db } from '../../services/firebase';
import { auth } from '../../services/firebase';

const template = new Template(html);
const userItems = db.ref('itemsByUser');

export default class UserPage {
  constructor() {
  }
  
  render() { 
    const dom = template.clone();
  
    this.header = dom.querySelector('#username-header');
    this.section = dom.querySelector('#user-item-list');


    return dom; 
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }


}
