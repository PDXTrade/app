import Template from '../../Template';
import html from './trade-list.html';
import './trade-list.css';
import { db } from '../../../services/firebase';
import TradeItem from './TradeItem';

const template = new Template(html);
const items = db.ref('items');

export default class TradeList {
  constructor(listRef) {
    this.list = listRef || items;
  }

  render() {
    const dom = template.clone(); 

    const tradeItem = dom.querySelector('div');

    const map = new Map();

    this.childAdded = this.list.on('child_added', data => {
      const item = new TradeItem(data.key);
      const itemDom = item.render();
      map.set(data.key, {
        component: item,
        nodes: [...itemDom.childNodes]
      });

      tradeItem.appendChild(itemDom);
    });

    this.childRemoved = this.list.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });

    this.childChange = this.list.on('child_changed', data => {
      map.get(data.key).component.update(data.val());
    });

    return dom;
  }

  unrender() {
    items.off('child_added', this.childAdded);
    items.off('child_removed', this.childRemoved);
    items.off('child_changed', this.childChange);
    this.map.forEach(({ component }) => component.unrender());
  }
}