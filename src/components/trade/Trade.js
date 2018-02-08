import Template from '../Template';
import html from './trade.html';
import './trade.css';
import UserPage from '../user/UserPage';
import ItemList from '../items/list/ItemList';
import { db, auth } from '../../services/firebase';

const template = new Template(html);



export default class Trade {


  render() {
    const dom = template.clone();
    const myKey = auth.currentUser.uid;
    console.log('myKey', myKey);
    const myItems = db.ref('itemsByUser').child(myKey);

    this.myHeader = dom.querySelector('.my-user');
    this.mySection = dom.querySelector('.my-item-list');    
    

    const myList = new ItemList(myItems).render();
    this.mySection.append(myList);

    
    return dom;
  }

  unrender() {
    // window.removeEventListener('hashchange', this.hashChange);
  }
}
