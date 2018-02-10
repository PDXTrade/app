import Template from '../Template';
import html from './trades-view-list.html';
import { db } from '../../services/firebase';

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

    aTag.href = `#trade/${this.tradeKey}`;

    this.trade = this.tradeRef.on('value', data => {
      const trade = data.val();
      myName.textContent = trade.user2Name;
      theirName.textContent = trade.user1Name;
    });

    return dom;
  }

  unrender() {
    this.tradeRef.off('value', this.trade);
  }

}