import Template from '../../Template';
import html from './trade-item.html';
import './trade-item.css';
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
    this.image.alt = item.title;
  }

  render() {
    const dom = template.clone();
    // const routes = window.location.hash.split('/');
    // const route = routes[0];
    
    // if(route === '#trade') {
    //   // apply checkbox to page
    //   const itemSelect = dom.querySelector('.item-check');
    //   const checkBox = document.createElement('input');
    //   checkBox.type = 'checkbox';
    //   itemSelect.appendChild(checkBox);
    // }
  
    dom.querySelector('a').href = `#items/item/${this.key}`;
    this.caption = dom.querySelector('h2');
    this.image = dom.querySelector('img');

    this.onValue = this.item.on('value', data => {
      this.update(data.val());
    });
    
    this.onImageValue = this.itemImages.on('child_added', data => {
      this.image.src = getURL(data.val(), 'c_fill,c_scale,w_150');
    });

    return dom;
  }

  unrender() {
    this.item.off('value', this.onValue);
    this.itemImages.off('child_added', this.onImageValue);
  }
}