import Template from '../../Template';
import html from './images.html';
import Image from './Image';
import { db, storage } from '../../../services/firebase';

const template = new Template(html);
const itemsImages = db.ref('items-images');
const itemImageStorage = storage.ref('items');

export default class Images {
  constructor(key) {
    this.itemsImages = itemsImages.child(key);
    this.imageStorage = itemImageStorage.child(key);
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