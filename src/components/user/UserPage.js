import Template from '../Template';
import html from './user-page.html';
import './user-page.css';
import ItemList from '../items/list/ItemList';

import { db } from '../../services/firebase';

const template = new Template(html);


export default class UserPage {
  
  render() { 
    
    const dom = template.clone();
        
    this.header = dom.querySelector('#username-header');
    this.section = dom.querySelector('#user-item-list');    
    
    const userKey = window.location.hash.split('/')[1];
    const userItems = db.ref('itemsByUser').child(userKey);
    const userList = new ItemList(userItems).render();

    const user = db.ref('users').child(userKey);
    const userName = user.name;

    this.header.textContent = userKey;
    this.section.append(userList);
    
    return dom; 
  }

  unrender() {
    // window.removeEventListener('hashchange', this.hashChange);
  }


}
