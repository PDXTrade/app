import Template from '../../../Template';
import html from './images.html';
import Image from './Image';
import { db, storage } from '../../../../services/firebase';

const template = new Template(html);
const itemImages = db.ref('itemImages');
const itemImageStorage = storage.ref('items');

export default class Images {
  constructor(key, editable) {
    this.itemsImages = itemImages.child(key);
    this.imageStorage = itemImageStorage.child(key);
    this.editable = editable;
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
    this.petImages.child(imageKey).remove();
    const storage = this.imageStorage.child(imageKey);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });
  }

  render() {
    const dom = template.clone();
    
    if(this.editable) {
      this.fileInput = dom.querySelector('input[type=file]');
      this.fileInput.addEventListener('change', event => {
        const files = event.target.files;
        if(!files || !files.length) return;
        this.handleUpload(files[0]);
      });

      const embedForm = dom.querySelector('form');
      embedForm.addEventListener('submit', event => {
        event.preventDefault();
        this.handleEmbed(event.target.elements.url.value);
      });
    }
    else {
      dom.querySelector('.upload').remove();
    }

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.petImages.on('child_added', data => {
      const image = new Image(data.val(), this.editable ? () => this.handleRemove(data.key) : null);
      const imageDom = image.render();
      map.set(data.key, {
        nodes: [...imageDom.childNodes],
        component: image
      });
      ul.appendChild(imageDom);
    });

    this.childRemoved = this.petImages.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove());
      // toRemove.component.unrender();
    });

    return dom;
  }

  unrender() {
    this.petImages.on('child_added', this.childAdded);
    this.petImages.on('child_removed', this.childRemoved);
  }
}