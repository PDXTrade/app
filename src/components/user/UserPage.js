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
    this.user = users.child(this.userKey);
    this.userItems = itemsByUser.child(this.userKey);
  }

  render() { 
    
    const dom = template.clone();
        
    const header = dom.querySelector('#username-header');
    const section = dom.querySelector('#user-item-list');    
    
    this.user.child('name').once('value', (data)=>{
      header.textContent = `${data.val()}'s items`;
    });

    const userList = new ItemList(this.userItems);
    section.append(userList.render());

    return dom; 
  }

  unrender() {

  }


}
