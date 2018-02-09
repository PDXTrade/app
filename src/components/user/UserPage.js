import Template from '../Template';
import html from './user-page.html';
import './user-page.css';
import ItemList from '../items/list/ItemList';

import { db } from '../../services/firebase';

const template = new Template(html);
const itemsByUser = db.ref('itemsByUser');
const users = db.ref('users');

export default class UserPage {
  
  constructor() {
    this.userKey = window.location.hash.split('/')[1];
  }

  render() { 
    
    const dom = template.clone();
        
    this.header = dom.querySelector('#username-header');
    this.section = dom.querySelector('#user-item-list');    
    
    this.userItems = itemsByUser.child(this.userKey);
    this.user = users.child(this.userKey);

    this.user.child('name').once('value', (data)=>{
      this.header.textContent = data.val();
    });

    const userList = new ItemList(this.userItems).render();
    this.section.append(userList);

    return dom; 
  }

  unrender() {

  }


}
