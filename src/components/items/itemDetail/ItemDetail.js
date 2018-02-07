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

  removeItem() {
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
    this.owner = dom.querySelector('#detail-owner');

    this.addImages = dom.querySelector('#image-upload');
    this.readonlys = dom.querySelectorAll('[readonly]');
    this.disabled = dom.querySelector('[disabled]');
    this.imageSection = dom.querySelector('section.images');
    this.removeButton = dom.querySelector('button.remove');
    this.cancelButton = dom.querySelector('button.cancel');
    this.submitButtons = dom.querySelector('label#submit-buttons');
    this.saveButton = dom.querySelector('button.save');
    this.editButton = dom.querySelector('button.edit');
    this.tradeButton = dom.querySelector('button.trade');
    this.form = dom.querySelector('#item-detail');

    this.onValue = this.item.on('value', data => {
      const item = data.val();
      // we might have deleted:
      if(!item) return;

      //pre-populate the form with data in database
      this.title.value = `${item.title}`;
      if(item.description) this.description.value = `${item.description}`;
      if(item.whishlist) this.whishlist.value = `${item.whishlist}`;
      if(item.category) this.category.querySelector(`[value=${item.category}]`).selected = true;
      this.owner.textContent = item.owner; //TODO: fix to username once users are in system

      const isOwner = item.owner === auth.currentUser.uid;

      // this.images = new Images(this.key, isOwner);
      // this.imageSection.append(this.images.render());

      if(isOwner) { //allow editing capabilities if owner
        this.tradeButton.classList.add('hidden');
        this.editButton.classList.remove('hidden');
        this.editButton.addEventListener('click', (event)=> {
          event.preventDefault();
          this.submitButtons.classList.remove('hidden');
          this.readonlys.forEach(item => item.readOnly = false);
          this.disabled.disabled = false;
          this.addImages.classList.remove('hidden');
        });
        this.removeButton.addEventListener('click', () => {
          this.removeItem();
        });
        this.cancelButton.addEventListener('click', () => {
          event.preventDefault();
          this.submitButtons.classList.add('hidden');
          this.title.readOnly = true;        
          this.description.readOnly = true;
          this.whishlist.readOnly = true;
          this.category.disabled = true;
        });
        this.form.addEventListener('submit', () => {
          // form logic
        });

      }
      else {
        this.removeButton.remove();
        this.cancelButton.remove();
        this.saveButton.remove();
        this.editButton.remove();
      }
    });

    return dom;
  }

  unrender() {
    items.child(this.key).off('value', this.onValue);
    this.images.unrender();
  }
}