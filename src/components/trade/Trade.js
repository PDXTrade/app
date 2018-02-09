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
    for(let key in offer){ //split up form into mine and theirs
      if(offer[key] === 'mine') myItems[key] = true;
      else theirItems[key] = true;
    }

    return this.trade.update({ //update the trade with the newly selected / deselected items
      offeredItems: myItems,
      desiredItems: theirItems
    });
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
    this.success = dom.querySelector('#success');


    this.myHeader.textContent = auth.currentUser.displayName;


    this.onValue = this.trade.on('value', data => {
      const trade = data.val();

      //protect from deletion
      if(!trade) return;
      const selectedItems = Object.keys(trade.desiredItems);
      if(trade.offeredItems) this.offeredItems = Object.keys(trade.offeredItems);

      this.theirHeader.textContent = trade.desiredOwnerName;
      const theirItems = itemsByUser.child(trade.desiredOwnerKey);
      const theirList = new TradeList(theirItems, 'theirs', selectedItems).render();
      this.theirSection.append(theirList);
      const myList = new TradeList(myItems, 'mine', this.offeredItems).render();
      this.mySection.append(myList);

    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      this.success.textContent = 'hello world';

      setTimeout(() => {this.handleSubmit(event.target)
        .then(() => {
          window.location.hash = 'items';
        });}, 2500);

      // this.handleSubmit(event.target)
      //   .then(() => {
      //     window.location.hash = 'items';
      //   });
    });

    return dom;
  }

  unrender() {
    this.trade.off('value', this.onValue);
  }
}
