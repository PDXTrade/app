import Template from '../../Template';
import html from './add-item.html';
import './add-item.css';
import { db, storage, auth } from '../../../services/firebase';

const template = new Template(html);
const items = db.ref('items');
const itemImages = db.ref('itemImages');
const itemsByUser = db.ref('itemsByUser');
const itemImageStorage = storage.ref('items');

export default class AddItem {
  constructor() {
    auth.onAuthStateChanged(user => {
      if(user) { this.myItems = itemsByUser.child(auth.currentUser.uid) }
    });
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

    this.error.textContent = '';

    const data = new FormData(form);
    const item = {};
    data.forEach((value, key) => item[key] = value); 
    delete item['image-upload']; 
    
    item.owner = auth.currentUser.uid;
    const ref = items.push();
    
    this.handleUpload(ref.key, this.fileInput.files[0])
      .then(({ url, imageRef }) => {
        const updates = {
          [ref.path]: item,
          [this.myItems.child(ref.key).path]: true,
          [imageRef.path]: url
        };

        return db.ref().update(updates);
      })
      .then(() => window.location.hash = `#items/item/${ref.key}`)
      .catch(err => this.error.textContent = err);
  }

  render() {
    const dom = template.clone();
    this.error = dom.querySelector('.error');

    const form = dom.querySelector('form');
    this.title = dom.querySelector('input[name=title]');
    this.fileInput = dom.querySelector('input[type=file]');
    
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(event.target);
    });

    dom.querySelector('button[type=button]').addEventListener('click', event => {
      event.preventDefault();
      window.location.hash = '#items';
    });
    
    return dom;
  }

  unrender() {

  }

}
