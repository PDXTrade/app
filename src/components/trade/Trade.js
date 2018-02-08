import Template from '../Template';
import html from './trade.html';
import './trade.css';
// import UserPage from '../user/UserPage';
import TradeList from './trade-list/TradeList';
import { db, auth } from '../../services/firebase';

const template = new Template(html);
const itemsByUser = db.ref('itemsByUser');


export default class Trade {
  constructor(theirKey, theirItemKey, theirName) {
    // this.theirKey = theirKey;
    this.theirName = theirName;
    this.theirItemKey = theirItemKey;
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
