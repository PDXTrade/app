import Template from '../../../Template';
import html from './image.html';
import './image.css';
import { getURL } from '../../../../services/cloudinary';

const template = new Template(html);

export default class Image {
  constructor(src, onRemove) {
    this.src = src;
    this.onRemove = onRemove;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('img').src = getURL(this.src, 'c_scale,w_300');

    const removeButton = dom.querySelector('button');
    
    if(this.onRemove) {
      removeButton.addEventListener('click', () => {
        this.onRemove();
      });
    }
    else {
      removeButton.remove();
    }

    return dom;
  }
}