import Template from '../../Template';
import html from './itemDetail.html';
import './itemDetail.css';
import { db, auth, storage } from '../../../services/firebase';
import Images from './images/Images';
import { removeChildren } from '../../dom';

const template = new Template(html);
const items = db.ref('items');
const itemImages = db.ref('itemImages');
const itemsByUser = db.ref('itemsByUser');
const itemImageStorage = storage.ref('items');
const userdb = db.ref('users');
const trades = db.ref('trades');
const tradesByUser = db.ref('tradesByUser');

export default class ItemDetail {
  constructor(key) {
    this.key = key;
    this.item = items.child(key);
    this.itemImages = itemImages.child(key);
  }

  removeItem() {
    if(!confirm('Are you sure you want to permanently delete this item?')) return;

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
    };  
  
    db.ref().update(updates)
      .then(() => window.location.hash = '#items')
      .catch(console.error);
  }

  handleUpload(itemKey, file) {
    
    const imageRef = itemImages.child(itemKey).push();

    const uploadTask = itemImageStorage.child(itemKey).child(imageRef.key).put(file);
    return new Promise((resolve, reject) => {

      uploadTask.on('state_changed', (/*snapshot*/) => {
        // progress, pause and cancel events
      }, reject, () => {
        // success! now let's get the download url...
        const downloadUrl = uploadTask.snapshot.downloadURL;
        this.fileInput.value = null;
  
        resolve({ url: downloadUrl, imageRef });
      });
    });
  }

  handleSubmit(form) {

    const data = new FormData(form);
    const item = {};
    data.forEach((value, key) => item[key] = value || null); 
    delete item['image-upload']; 
    item.owner = auth.currentUser.uid;

    items.child(this.key).set(item);
    
    this.submitButtons.classList.add('hidden');
    this.title.readOnly = true;        
    this.description.readOnly = true;
    this.wishlist.readOnly = true;
    this.category.disabled = true;
    this.editButton.classList.remove('hidden');
  }

  handleTradesByUsers(desiredItemOwnerId, myUserId, trade) {
    const myRef = tradesByUser.child(desiredItemOwnerId);
    const theirRef = tradesByUser.child(myUserId);
    
    const updates = {
      [`${myRef.path}/${trade.key}`]: true,
      [`${theirRef.path}/${trade.key}`]: true 
    };

    return db.ref().update(updates);
  }

  handleTrade(desiredKey, desiredItemOwnerId, desiredItemOwnerUserName, myUserId, myUserName) {
    const trade = trades.child(`${myUserId}${desiredItemOwnerId}`);
    this.handleTradesByUsers(desiredItemOwnerId, myUserId, trade);

    return trade.update({
      user1Key: desiredItemOwnerId,
      user1Name: desiredItemOwnerUserName,
      user2Key: myUserId,
      user2Name: myUserName,
      [`user1Items/${desiredKey}`]: true
    })
      .then(() => trade.key);
  }

  render() {
    const dom = template.clone();
    this.title = dom.querySelector('#detail-title');
    this.description = dom.querySelector('#detail-description');
    this.wishlist = dom.querySelector('#detail-wishlist');
    this.category = dom.querySelector('#category-assign');
    this.owner = dom.querySelector('#detail-owner');

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

    if(!auth.currentUser) this.tradeButton.classList.add('hidden');

    this.onValue = this.item.on('value', data => {
      const item = data.val();
      // we might have deleted:
      if(!item) return;

      //pre-populate the form with data in database
      this.title.value = `${item.title}`;
      if(item.description) this.description.value = `${item.description}`;
      if(item.wishlist) this.wishlist.value = `${item.wishlist}`;
      if(item.category) this.category.querySelector(`[value=${item.category}]`).selected = true;
      this.owner.href = `/#user/${item.owner}`;
      userdb.child(item.owner).child('name').once('value', (data)=>{
        this.owner.textContent = data.val();
        this.ownerName = data.val();
      });
      //add images
      const ownerExists = (auth.currentUser) ? auth.currentUser.uid : false;
      const isOwner = item.owner === ownerExists;
      this.images = new Images(this.key, isOwner, this.editButton, this.cancelButton, this.form);
      removeChildren(this.imageSection);
      this.imageSection.append(this.images.render());

      //if trade button is clicked
      this.tradeButton.addEventListener('click', (event)=> {
        event.preventDefault();
        this.handleTrade(this.key, item.owner, this.ownerName, auth.currentUser.uid, auth.currentUser.displayName)
          .then((tradeHash) => {
            window.location.hash = `trade/${tradeHash}`;
          });
      });

      //allow editing capabilities if owner
      if(isOwner) { 
        this.tradeButton.classList.add('hidden');
        this.editButton.classList.remove('hidden');
        this.editButton.addEventListener('click', (event)=> {
          event.preventDefault();
          this.editButton.classList.add('hidden');
          this.submitButtons.classList.remove('hidden');
          this.readonlys.forEach(item => item.readOnly = false);
          this.disabled.disabled = false;
        });
        this.removeButton.addEventListener('click', () => {
          this.removeItem();
        });
        this.cancelButton.addEventListener('click', () => {
          event.preventDefault();
          this.editButton.classList.remove('hidden');
          this.submitButtons.classList.add('hidden');
          this.title.readOnly = true;        
          this.description.readOnly = true;
          this.wishlist.readOnly = true;
          this.category.disabled = true;

        });
        this.form.addEventListener('submit', (event) => {
          event.preventDefault();
          this.handleSubmit(event.target);
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
    this.item.off('value', this.onValue);
    this.images.unrender();
  }
}