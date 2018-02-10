import Template from '../../../Template';
import html from './images.html';
import Image from './Image';
import { db, storage } from '../../../../services/firebase';

const template = new Template(html);
const itemImages = db.ref('itemImages');
const itemImageStorage = storage.ref('items');

export default class Images {
  constructor(key, editable, editButton, cancelButton, form) {
    this.itemsImages = itemImages.child(key);
    this.imageStorage = itemImageStorage.child(key);
    this.editable = editable;
    this.editButton = editButton;
    this.cancelButton = cancelButton;
    this.form = form;
  }

  handleUpload(file) {
    const itemImage = this.itemsImages.push();
    const uploadTask = this.imageStorage.child(itemImage.key).put(file);

    uploadTask.on('state_changed', () => {

    }, err => {
      console.error(err);
    }, () => {
      const downloadUrl = uploadTask.snapshot.downloadURL;
      this.fileInput.value = null;
      itemImage.set(downloadUrl);
    });
  }

  handleRemove(imageKey) {
    this.itemsImages.child(imageKey).remove();
    const storage = this.imageStorage.child(imageKey);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });
  }

  render() {
    const dom = template.clone();
    this.uploadImages = dom.querySelector('section.upload');
    
    if(this.editable) {
      this.fileInput = dom.querySelector('input[type=file]');
      this.fileInput.addEventListener('change', event => {
        const files = event.target.files;
        if(!files || !files.length) return;
        this.handleUpload(files[0]);
      });
      this.editButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.uploadImages.classList.remove('hidden');
      });
      this.cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.uploadImages.classList.add('hidden');
      });
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.uploadImages.classList.add('hidden');
      });
    }
    else {
      dom.querySelector('.upload').remove();
    }

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.itemsImages.on('child_added', data => {
      const image = new Image(data.val(), this.editable ? () => this.handleRemove(data.key) : null, this.editButton, this.cancelButton, this.form);
      const imageDom = image.render();
      map.set(data.key, {
        nodes: [...imageDom.childNodes],
        component: image
      });
      ul.appendChild(imageDom);
    });

    this.childRemoved = this.itemsImages.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove());
    });

    return dom;
  }

  unrender() {
    this.itemsImages.on('child_added', this.childAdded);
    this.itemsImages.on('child_removed', this.childRemoved);
  }
}