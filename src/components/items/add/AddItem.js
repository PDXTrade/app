import Template from '../../Template';
import html from './add-item.html';
import './add-item.css';
import { db, storage, auth } from '../../../services/firebase';

const template = new Template(html);
const items = db.ref('items');
const itemImageStorage = db.ref('item-images');
const itemsByUser = db.ref('itemsByUser');

export default class AddItem {
  constructor(onAdd) {
    this.onAdd = onAdd;
    const currentUser = auth.currentUser;
    this.myItems = itemsByUser.child(currentUser.uid);
  }
  // handleUpload(file) {

  //   if (filesArray.length < 6) filesArray.push(file);
  //   else {
  //     this.fileInput.readOnly = true;
  //   }

  //   const uploadTask = this.imageStorage.child(petImage.key).put(file);

  //   uploadTask.on('state_changed', (/*snapshot*/) => {
  //     // progress, pause and cancel events
  //   }, err => {
  //     // something went wrong :(
  //     console.error(err);
  //   }, () => {
  //     // success! now let's get the download url...
  //     const downloadUrl = uploadTask.snapshot.downloadURL;
  //     this.fileInput.value = null;
  //     petImage.set(downloadUrl);
  //   });
  // }

  handleSubmit(form) {

    this.error.textContent = '';

    const data = new FormData(form);
    const item = {};
    data.forEach((value, key) => item[key] = value);  
    
    item.owner = auth.currentUser.uid;
    const ref = items.push();

    updates = {
      [ref.path]: item,
      [this.myItems.child(ref.key).path]: true
    };

    db.ref().update(updates)
      .then(() => {
        
      })
      .then(() => window.location.hash = `#items/${ref.key}`)
      .catch(err => this.error.textContent = err);

    this.items = items.child(key);
    this.imageStorage = itemImageStorage.child(key);
    const item = this.items.push();
    const uploadTask = this.imageStorage.child(itemImage.key).put(file);
  }

  render() {
    const dom = template.clone();
    this.error = dom.querySelector('.error');

    const form = dom.querySelector('form');
    this.title = dom.querySelector('input[name=title]');
    this.fileInput = dom.querySelector('input[type=file]');
    
    // form.addEventListner('submit', (event) => {
    //   event.preventDefault();
    //   this.handleSubmit(event.target);
    // });

    dom.querySelector('button[type=button]').addEventListener('click', event => {
      event.preventDefault();
      window.location.hash = '#items';
    });
    
    return dom;
  }

  unrender() {

  }

}
