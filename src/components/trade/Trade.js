import Template from '../Template';
import html from './trade.html';
import './trade.css';
import TradeList from './trade-list/TradeList';
import { db, auth } from '../../services/firebase';

const template = new Template(html);
const itemsByUser = db.ref('itemsByUser');
const trades = db.ref('trades');

export default class Trade {
  constructor() {
    const hash = window.location.hash.split('/');
    this.tradeKey = hash[1];
    this.trade = trades.child(this.tradeKey);
  }

  render() {
    const dom = template.clone();
    const myItems = itemsByUser.child(auth.currentUser.uid);
   

    this.myHeader = dom.querySelector('.my-user');
    this.mySection = dom.querySelector('.my-item-list');  
    this.theirSection = dom.querySelector('.their-item-list');  
    this.theirHeader = dom.querySelector('.their-user');

    this.myHeader.textContent = auth.currentUser.displayName;

    const myList = new TradeList(myItems).render();
    this.mySection.append(myList);

    this.onValue = this.trade.on('value', data => {
      const trade = data.val();

      //protect from deletion
      if(!trade) return;

      this.theirHeader = trade.desiredOwnerName;
      const theirItems = itemsByUser.child(trade.desiredOwnerKey);
      const theirList = new TradeList(theirItems).render();
      this.theirSection.append(theirList);

    });

    
    return dom;
  }

  unrender() {
    // window.removeEventListener('hashchange', this.hashChange);
  }
}
