import Template from '../Template';
import html from './trades-view.html';
import TradesViewList from './tradesViewList';
import 'tradesView.css';
import { auth, db } from '../../services/firebase';

const tradesByUser = db.ref('tradesByUser');
const template = new Template(html);

export default class TradesView {

  constructor(){
    this.myTrades = tradesByUser.child(auth.currentUser.uid);
  }

  render() {

    const dom = template.clone();

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.myTrades.on('child_added', data => {
      const trade = new TradesViewList(data.key);
      const tradeDom = trade.render();
      map.set(data.key, {
        nodes: [...tradeDom.childNodes],
        component: trade
      });
      ul.appendChild(tradeDom);
    });

    this.childRemoved = this.myTrades.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove());
    });

    return dom;
  }

  unrender() {
    this.myTrades.on('child_added', this.childAdded);
    this.myTrades.on('child_removed', this.childRemoved);
  }

}