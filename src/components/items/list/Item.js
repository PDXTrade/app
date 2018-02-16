import Template from '../../Template';
import html from './item.html';
import './item.css';
import { db } from '../../../services/firebase';
import { getURL } from '../../../services/cloudinary';

const template = new Template(html);
const items = db.ref('items');
const itemImages = db.ref('itemImages');

export default class Item {
  constructor(key) {
    this.key = key;
    this.item = items.child(key);
    this.itemImages = itemImages.child(key).limitToFirst(1);

    
  }

  update(item) {
    this.caption.textContent = `${item.title}`;
    /* good job providing alt descriptions */
    this.image.alt = item.title;
  }

  render() {
    const dom = template.clone();
  
    dom.querySelector('a').href = `#items/item/${this.key}`;
    this.caption = dom.querySelector('h2');
    this.image = dom.querySelector('img');

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