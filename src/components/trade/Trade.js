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
   
    this.myHeader = dom.querySelector('h1.my-user');
    this.mySection = dom.querySelector('section.my-item-list');  
    this.theirSection = dom.querySelector('section.their-item-list');  
    this.theirHeader = dom.querySelector('h1.their-user');
    this.form = dom.querySelector('form');
    this.myFieldset = dom.querySelector('#my-fieldset');
    this.success = dom.querySelector('#success');
    this.aTagMine = dom.querySelector('.my-a');
    this.aTagTheirs = dom.querySelector('.their-a');

    this.onValue = this.trade.on('value', data => {
      const trade = data.val();

      //protect from deletion
      if(!trade) return;
    
      let myItems, theirItems, selectedItems; //to allow offerer / offeree to be switched around
      (auth.currentUser.uid === trade.offeredOwnerKey) ? (
        (myItems = itemsByUser.child(trade.offeredOwnerKey)),
        (theirItems = itemsByUser.child(trade.desiredOwnerKey)),
        (this.myHeader.textContent = trade.offeredOwnerName),
        (this.theirHeader.textContent = trade.desiredOwnerName),
        (selectedItems = Object.keys(trade.desiredItems)),
        (this.aTagMine.href = `/#user/${trade.offeredOwnerKey}`),
        (this.aTagTheirs.href = `/#user/${trade.desiredOwnerKey}`)

      ) : (
        (myItems = itemsByUser.child(trade.desiredOwnerKey)),
        (theirItems = itemsByUser.child(trade.offeredOwnerKey)),
        (this.theirHeader.textContent = trade.offeredOwnerName),
        (this.myHeader.textContent = trade.desiredOwnerName),
        (selectedItems = Object.keys(trade.offeredItems)),
        (this.aTagTheirs.href = `/#user/${trade.offeredOwnerKey}`),
        (this.aTagMine.href = `/#user/${trade.desiredOwnerKey}`)
      );

      //check for existance first
      if(auth.currentUser.uid === trade.offeredOwnerKey) {
        if(trade.offeredItems) this.offeredItems = Object.keys(trade.offeredItems);
      } else {
        if(trade.desiredItems) this.offeredItems = Object.keys(trade.desiredItems);
      }

      const theirList = new TradeList(theirItems, 'theirs', selectedItems).render();
      this.theirSection.append(theirList);
      const myList = new TradeList(myItems, 'mine', this.offeredItems).render();
      this.mySection.append(myList);

    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(event.target);
      this.success.classList.remove('hidden');

      setTimeout(() => {
        window.location.hash = `tradeview/${auth.currentUser.uid}`;
      }, 1000);

    });

    return dom;
  }

  unrender() {
    this.trade.off('value', this.onValue);
  }
}
