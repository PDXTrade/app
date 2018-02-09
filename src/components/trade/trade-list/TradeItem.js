import Template from '../../Template';
import html from './trade-item.html';
import './trade-item.css';
import { db } from '../../../services/firebase';
import { getURL } from '../../../services/cloudinary';

const template = new Template(html);
const items = db.ref('items');
const itemImages = db.ref('itemImages');

export default class TradeItem {
  constructor(key, name, selectedItems) {
    this.key = key;
    this.item = items.child(key);
    this.itemImages = itemImages.child(key).limitToFirst(1);
    this.name = name;
    if(selectedItems) (selectedItems !== [] && selectedItems.includes(this.key)) ? this.selectedItems = false : this.selectedItems = selectedItems;
  }

  update(item) {
    this.label.textContent = `${item.title}`;
    this.image.alt = item.title;
    if(this.selectedItems) this.input.checked = true; 
  }

  render() {
    const dom = template.clone();
  
    this.aTag = dom.querySelector('a');
    this.image = dom.querySelector('img');
    this.input = dom.querySelector('input');
    this.label = dom.querySelector('label');

    this.input.setAttribute('value', this.key);
    this.aTag.href = `#items/item/${this.key}`;
    this.input.setAttribute('name', this.name);
    this.label.setAttribute('for', this.key);

    this.onValue = this.item.on('value', data => {
      this.update(data.val());
    });
    
    this.onImageValue = this.itemImages.on('child_added', data => {
      this.image.src = getURL(data.val(), 'c_fill,q_auto,w_300,h_300');
    });

    return dom;
  }

  unrender() {
    this.item.off('value', this.onValue);
    this.itemImages.off('child_added', this.onImageValue);
  }
}