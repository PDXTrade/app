import Template from '../Template';
import html from './trade.html';
import './trade.css';
// import UserPage from '../user/UserPage';
import TradeList from './trade-list/TradeList';
import { db, auth } from '../../services/firebase';

const template = new Template(html);
const itemsByUser = db.ref('itemsByUser');
const items = db.ref('items');
const itemImages = db.ref('itemImages');
// const itemImageStorage = storage.ref('items');
const userdb = db.ref('users');


export default class Trade {
  constructor() {
    const hash = window.location.hash.split('/');
    this.desiredItemKey = hash[1];
  }

  render() {
    const dom = template.clone();
    const myItems = itemsByUser.child(auth.currentUser.uid);
    // const theirItems = itemsByUser.child(this.theirKey);

    this.myHeader = dom.querySelector('.my-user');
    this.mySection = dom.querySelector('.my-item-list');  
    this.theirSection = dom.querySelector('.their-item-list');  
    this.theirHeader = dom.querySelector('.their-user');

    this.myHeader.textContent = auth.currentUser.displayName;


    const myList = new TradeList(myItems).render();
    this.mySection.append(myList);
    // const theirList = new TradeList(theirItems).render();
    // this.theirSection.append(theirList);

    
    return dom;
  }

  unrender() {
    // window.removeEventListener('hashchange', this.hashChange);
  }
}
