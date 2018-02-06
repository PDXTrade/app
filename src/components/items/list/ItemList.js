
import Template from '../../Template';
import html from './item-list.html';
import './item-list.css';
import { db } from '../../../services/firebase';

const template = new Template(html);

export default class ItemList {
  constructor(listRef) { //pass in list of items and reference in database?
    this.listRef = db.ref(listRef);
  }

  render() {
    const dom = template.clone(); 

    const ul = dom.querySelector('ul');

    const map = new Map();

    this.childAdded = this.listRef.on('child_added', data => {
      const item = new Item(data.key, data.val());
      const itemDom = item.render();
      map.set(data.key, {
        component: item,
        nodes: [...itemDom.childNodes]
      });

      ul.appendChild(itemDom);
    });

    this.childRemoved = this.listRef.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });

    this.childChange = this.listRef.on('child_changed', data => {
      map.get(data.key).component.update(data.val());
    });

    return dom;
  
  }
}