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
    const user = auth.currentUser;
    const userList = new ItemList(userItems.key);

    this.header = dom.querySelector('#username-header');
    this.header.textContent = user.displayName;
    this.section = dom.querySelector('#user-item-list');


    return dom; 
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }


}
