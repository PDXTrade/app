import Template from '../../Template';
import html from './image.html';
import './image.css';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);

export default class Image {
  constructor(src, onRemove) {
    this.src = src;
    this.onRemove = onRemove;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('img').src = getUrl(this.src, 'h_250,w_250');
    dom.querySelector('button').addEventListener('click', () => {
      this.onRemove();
    });

    return dom;
  }
}