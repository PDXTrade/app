import Template from '../Template';
import html from './trades-view-list.html';
import { db, auth } from '../../services/firebase';

const template = new Template(html);
const trades = db.ref('trades');

export default class TradesViewList {

  constructor(tradeKey){
    this.tradeRef = trades.child(tradeKey);
    this.tradeKey = tradeKey;
  }

  render() {

    const dom = template.clone();

    const myName = dom.querySelector('span.my-name');
    const theirName = dom.querySelector('span.their-name');
    const aTag = dom.querySelector('a');
    const status = dom.querySelector('.status');

    aTag.href = `#trade/${this.tradeKey}`;

    this.trade = this.tradeRef.on('value', data => {
      const trade = data.val();
      myName.textContent = trade.user2Name;
      theirName.textContent = trade.user1Name;

      if(trade.status) {
        if(auth.currentUser.uid === trade.sentBy && (trade.status === 'new offer' || trade.status === 'counter offer')) status.textContent = 'pending';
        else if(auth.currentUser.uid !== trade.sentBy && trade.status === 'new offer') status.textContent = 'new offer';
        else if(auth.currentUser.uid !== trade.sentBy && trade.status === 'counter offer') status.textContent = 'new counter offer';
        else if(trade.status === 'accepted' || trade.status === 'rejected') status.textContent = trade.status;
      } else {
        status.textContent = 'new trade pending';
      }
    });

    return dom;
  }

  unrender() {
    this.tradeRef.off('value', this.trade);
  }

}