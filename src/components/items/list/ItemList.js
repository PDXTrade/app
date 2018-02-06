
import Template from '../../Template';
import html from './item-list.html';
import './item-list.css';
import { db } from '../../../services/firebase';
import Item from './Item';

const template = new Template(html);
const items = db.ref('items');

export default class ItemList {
  constructor(listRef) {
    this.list = db.ref(listRef) || items;
  }

  render() {
    const dom = template.clone(); 

    const ul = dom.querySelector('ul');

    const map = new Map();

    this.childAdded = this.list.on('child_added', data => {
      const item = new Item(data.key);
      const itemDom = item.render();
      map.set(data.key, {
        component: item,
        nodes: [...itemDom.childNodes]
      });

      ul.appendChild(itemDom);
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