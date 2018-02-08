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

  handleSubmit(form) {
    const data = new FormData(form);
    const offer = {};
    data.forEach((value, name) => offer[value] = name); 
    const myItems = {};
    const theirItems = {};
    for(let key in offer){
      if(offer[key] === 'mine') myItems[key] = true;
      else theirItems[key] = true;
    }
    // const promise1 = new Promise.resolve(this.trade.child('desiredItems').set(theirItems));
    // const promise2 = new Promise.resolve(this.trade.child('offeredItems').set(myItems));

    // return Promise.all(promise1, promise2);

      // this.trade.child('offeredItems').set(myItems);
      // this.trade.child('desiredItems').set(theirItems)
  }

  render() {
    const dom = template.clone();
    const myItems = itemsByUser.child(auth.currentUser.uid);
   
    this.myHeader = dom.querySelector('h1.my-user');
    this.mySection = dom.querySelector('section.my-item-list');  
    this.theirSection = dom.querySelector('section.their-item-list');  
    this.theirHeader = dom.querySelector('h1.their-user');
    this.form = dom.querySelector('form');
    this.myFieldset = dom.querySelector('#my-fieldset');

    this.myHeader.textContent = auth.currentUser.displayName;

    const myList = new TradeList(myItems, 'mine').render();
    this.mySection.append(myList);

    this.onValue = this.trade.on('value', data => {
      const trade = data.val();

      //protect from deletion
      if(!trade) return;
      const selectedItem = Object.keys(trade.desiredItems)[0];

      this.theirHeader.textContent = trade.desiredOwnerName;
      const theirItems = itemsByUser.child(trade.desiredOwnerKey);
      const theirList = new TradeList(theirItems, 'theirs', selectedItem).render();
      this.theirSection.append(theirList);

    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(event.target)
        .then(() => window.location.hash = 'items');
    });

    return dom;
  }

  unrender() {
    this.trade.off('value', this.onValue);
  }
}
