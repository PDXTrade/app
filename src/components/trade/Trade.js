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

      if(!trade.sentBy) this.status = 'new offer';
      else if(trade.sentBy === auth.currentUser.uid && trade.status !== 'rejected' && trade.status !== 'accepted') {
        this.offerButton.classList.add('hidden');
        this.counterButton.classList.add('hidden');
        this.rejectButton.classList.add('hidden');
        this.myFieldset.disabled = true;
        this.theirFieldset.disabled = true;
      } else if(trade.sentBy !== auth.currentUser.uid && trade.status !== 'rejected' && trade.status !== 'accepted') {
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
    
      let myItems, theirItems, theirName, myName; //to allow offerer / offeree to be switched around
      (auth.currentUser.uid === trade.user2Key) ? (
        (myItems = itemsByUser.child(trade.user2Key)),
        (theirItems = itemsByUser.child(trade.user1Key)),
        (this.myHeader.textContent = trade.user2Name),
        (this.theirHeader.textContent = trade.user1Name),
        (this.aTagMine.href = `/#user/${trade.user2Key}`),
        (this.aTagTheirs.href = `/#user/${trade.user1Key}`),
        (myName = 'mine'),
        (theirName = 'theirs')
      ) : (
        (myItems = itemsByUser.child(trade.user1Key)),
        (theirItems = itemsByUser.child(trade.user2Key)),
        (this.theirHeader.textContent = trade.user2Name),
        (this.myHeader.textContent = trade.user1Name),
        (this.aTagTheirs.href = `/#user/${trade.user2Key}`),
        (this.aTagMine.href = `/#user/${trade.user1Key}`),
        (myName = 'theirs'),
        (theirName = 'mine')
      );
      if(auth.currentUser.uid === trade.user2Key) {
        if(trade.user2Items) this.mySelectedItems = Object.keys(trade.user2Items);
        if(trade.user1Items) this.theirSelectedItems = Object.keys(trade.user1Items);
      } else {
        if(trade.user2Items) this.theirSelectedItems = Object.keys(trade.user2Items);
        if(trade.user1Items) this.mySelectedItems = Object.keys(trade.user1Items);
      }
      if(this.mySection.children.length > 0) {
        removeChildren(this.mySection);
        removeChildren(this.theirSection);
      }

      const theirList = new TradeList(theirItems, theirName, this.theirSelectedItems).render();
      this.theirSection.append(theirList);
      const myList = new TradeList(myItems, myName, this.mySelectedItems).render();
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
