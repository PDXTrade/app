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
      user2Items: myItems,
      user1Items: theirItems
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
    
      let myItems, theirItems; //to allow offerer / offeree to be switched around
      (auth.currentUser.uid === trade.user2Key) ? (
        (myItems = itemsByUser.child(trade.user2Key)),
        (theirItems = itemsByUser.child(trade.user1Key)),
        (this.myHeader.textContent = trade.user2Name),
        (this.theirHeader.textContent = trade.user1Name),
        (this.aTagMine.href = `/#user/${trade.user2Key}`),
        (this.aTagTheirs.href = `/#user/${trade.user1Key}`)
      ) : (
        (myItems = itemsByUser.child(trade.user1Key)),
        (theirItems = itemsByUser.child(trade.user2Key)),
        (this.theirHeader.textContent = trade.user2Name),
        (this.myHeader.textContent = trade.user1Name),
        (this.aTagTheirs.href = `/#user/${trade.user2Key}`),
        (this.aTagMine.href = `/#user/${trade.user1Key}`)
      );
      if(auth.currentUser.uid === trade.user2Key) {
        if(trade.user2Items) this.mySelectedItems = Object.keys(trade.user2Items);
        if(trade.user1Items) this.theirSelectedItems = Object.keys(trade.user1Items);
      } else {
        if(trade.user2Items) this.theirSelectedItems = Object.keys(trade.user2Items);
        if(trade.user1Items) this.mySelectedItems = Object.keys(trade.user1Items);
      }

      console.log('user2 items:', trade.user2Items);
      console.log('user2 Name:', trade.user2Name);
      console.log('user1 items:', trade.user1Items);
      console.log('user1 Name:', trade.user1Name);
      
      const theirList = new TradeList(theirItems, 'theirs', this.theirSelectedItems).render();
      this.theirSection.append(theirList);
      const myList = new TradeList(myItems, 'mine', this.mySelectedItems).render();
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
