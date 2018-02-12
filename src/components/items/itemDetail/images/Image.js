import Template from '../../../Template';
import html from './image.html';
import './image.css';
import { getURL } from '../../../../services/cloudinary';

const template = new Template(html);

export default class Image {
  constructor(src, onRemove, editButton, cancelButton, form) {
    this.src = src;
    this.onRemove = onRemove; 
    this.editButton = editButton;
    this.cancelButton = cancelButton;
    this.form = form;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('img').src = getURL(this.src, 'c_fill,q_auto,w_500,h_500');

    const removeButton = dom.querySelector('button');
    
    if(this.onRemove) {
      removeButton.addEventListener('click', () => {
        this.onRemove();
      });
    }
    else {
      removeButton.remove();
    }

    this.editButton.addEventListener('click', (event) => {
      event.preventDefault();
      removeButton.classList.remove('hidden');
    });
    this.cancelButton.addEventListener('click', (event) => {
      event.preventDefault();
      removeButton.classList.add('hidden');
    });
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      removeButton.classList.add('hidden');
    });

    return dom;
  }
}