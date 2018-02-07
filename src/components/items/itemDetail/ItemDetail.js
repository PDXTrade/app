import Template from '../../Template';
import html from './itemDetail.html';
import './itemDetail.css';
import { db, auth, storage } from '../../../services/firebase';
import { getUrl } from '../../../services/cloudinary';
import Images from './images/Images';

const template = new Template(html);
const items = db.ref('items');
const itemImages = db.ref('itemImages');
const itemsByUser = db.ref('itemsByUser');
const itemImageStorage = storage.ref('items');

export default class Item {
  constructor(key) {
    this.key = key;
    this.item = items.child(key);
    this.itemImages = itemImages.child(key);
  }

  removePet() {
    if(!confirm('Are you sure you want to permanently remove this item?')) return;

    const storage = itemImageStorage.child(this.key);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });

    const updates = {
      [items.child(this.key).path]: null,
      [itemImages.child(this.key).path]: null,
      [itemsByUser.child(auth.currentUser.uid).child(this.key).path]: null
      //TODO: remove from categories
    };  
  
    db.ref().update(updates)
      .then(() => window.location.hash = '#items')
      .catch(console.error);
    // TODO:
    // .catch(err => this.error.textContent = err);

  }

  render() {
    const dom = template.clone();
    this.title = dom.querySelector('#detail-title');
    this.description = dom.querySelector('#detail-description');
    this.whishlist = dom.querySelector('#detail-whishlist');
    this.category = dom.querySelector('#category-assign');

    const imageSection = dom.querySelector('section.images');
    const removeButton = dom.querySelector('button.remove');

    this.onValue = this.item.on('value', data => {
      const item = data.val();
      // we might have deleted:
      if(!item) return;

      this.title.placeholder = `${item.title}`;
      if(item.description) this.description.placeholder = `${item.description}`;
      if(item.category) this.category.querySelector(`[value=${item.category}]`).selected = true;

      const isOwner = item.owner === auth.currentUser.uid;

      this.images = new Images(this.key, isOwner);
      imageSection.append(this.images.render());

      if(isOwner) {
        removeButton.addEventListener('click', () => {
          this.removeitem();
        });
      }
      else {
        removeButton.remove();
      }
    });

    return dom;
  }

  unrender() {
    items.child(this.key).off('value', this.onValue);
    this.images.unrender();
  }
}