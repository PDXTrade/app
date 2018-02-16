import Template from '../Template';
import html from './trade.html';
import './trade.css';
import TradeList from './trade-list/TradeList';
import { db, auth } from '../../services/firebase';
import { removeChildren } from '../dom';

const template = new Template(html);
const itemsByUser = db.ref('itemsByUser');
const trades = db.ref('trades');

export default class Trade {
  constructor() {
    const hash = window.location.hash.split('/');
    this.tradeKey = hash[1];
    this.trade = trades.child(this.tradeKey);
  }

  handleSubmit(form, status) {
    const data = new FormData(form);
    const myItems = {};
    const theirItems = {};
    data.forEach((value, name) => {
      if(name === 'mine') myItems[value] = true;
      else theirItems[value] = true;
    });

    return this.trade.update({ //update the trade with the newly selected / deselected items
      user2Items: myItems,
      user1Items: theirItems,
      sentBy: auth.currentUser.uid,
      status: status
    });
    
  }

  render() {
    const dom = template.clone();
   
    this.myHeader = dom.querySelector('h1.my-user');
    this.mySection = dom.querySelector('section.my-item-list'); 
    this.myFieldset = dom.querySelector('#my-fieldset'); 
    this.theirSection = dom.querySelector('section.their-item-list');  
    this.theirHeader = dom.querySelector('h1.their-user');
    this.theirFieldset = dom.querySelector('#their-fieldset');
    this.form = dom.querySelector('form');
    this.myFieldset = dom.querySelector('#my-fieldset');
    this.success = dom.querySelector('#success');
    this.aTagMine = dom.querySelector('.my-a');
    this.aTagTheirs = dom.querySelector('.their-a');
    this.counterButton = dom.querySelector('#counter');
    this.offerButton = dom.querySelector('#offer');
    this.rejectButton = dom.querySelector('#reject');

    this.onValue = this.trade.on('value', data => {
      const trade = data.val();

      const notAcceptedOrRejected = trade.status !== 'rejected' && trade.status !== 'accepted';

      if(!trade.sentBy) this.status = 'new offer';
      else if(trade.sentBy === auth.currentUser.uid && notAcceptedOrRejected) {
        this.offerButton.classList.add('hidden');
        this.counterButton.classList.add('hidden');
        this.rejectButton.classList.add('hidden');
        this.myFieldset.disabled = true;
        this.theirFieldset.disabled = true;
      } else if(trade.sentBy !== auth.currentUser.uid && notAcceptedOrRejected) {
        this.offerButton.textContent = 'Accept';
        this.offerButton.classList.remove('hidden');
        this.rejectButton.classList.remove('hidden');
        this.counterButton.classList.remove('hidden');
        this.status = 'accepted';
        this.myFieldset.disabled = false;
        this.theirFieldset.disabled = false;
      } else {
        this.offerButton.classList.add('hidden');
        this.counterButton.classList.add('hidden');
        this.rejectButton.classList.add('hidden');
        this.success.textContent = `This trade was ${trade.status}`;
        this.success.classList.remove('hidden');
        this.myFieldset.disabled = true;
        this.theirFieldset.disabled = true;
      }

      //protect from deletion
      if(!trade) return;
    
      // Don't abuse ternaries like this. Hard to read and harder to edit

      // Would be better if you had put user1: { key, name, items }, user2: { key, name, items } in firebase.
      // It would also have allowed you to create separate TradeOffer Component, that you could have just passed
      // ref to.
      // But assuming just the data change, code would become something like:

      //to allow offerer / offeree to be switched around
      const my = (auth.currentUser.uid === trade.user2.key) ? trade.user2 : trade.user1;
      const theirs = (auth.currentUser.uid === trade.user2.key) ? trade.user1 : trade.user2;
      
      const myItems = itemsByUser.child(my.key);
      const theirItems = itemsByUser.child(theirs.key);
      this.myHeader.textContent = my.name;
      this.theirHeader.textContent = theirs.name;
      this.aTagMine.href = `/#user/${my.key}`;
      this.aTagTheirs.href = `/#user/${theirs.key}`;
      // (myName = 'mine'),
      // (theirName = 'theirs')


      if(my.items) this.mySelectedItems = Object.keys(my.items);
      if(theirs.items) this.theirSelectedItems = Object.keys(theirs.items);
      
      if(this.mySection.children.length > 0) {
        removeChildren(this.mySection);
        removeChildren(this.theirSection);
      }

      const theirList = new TradeList(theirItems, 'theirs', this.theirSelectedItems).render();
      this.theirSection.append(theirList);
      const myList = new TradeList(myItems, 'mine', this.mySelectedItems).render();
      this.mySection.append(myList);

    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(event.target, this.status);
      this.success.classList.remove('hidden');

      setTimeout(() => {
        window.location.hash = `tradeview/${auth.currentUser.uid}`;
      }, 1000);
    });

    this.rejectButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.status = 'rejected';
      this.handleSubmit(this.form, this.status);
      this.success.classList.remove('hidden');

      setTimeout(() => {
        window.location.hash = `tradeview/${auth.currentUser.uid}`;
      }, 1000);
    });

    this.counterButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.status = 'counter offer';
      this.handleSubmit(this.form, this.status);
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
