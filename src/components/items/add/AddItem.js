import Template from '../../Template';
import html from './add-item.html';
import './add-item.css';
import { db } from '../../../services/firebase';

const template = new Template(html);
const items = db.ref('items');

export default class AddItem {
  constructor(onAdd) {
    this.onAdd = onAdd;
  }

  render() {
    const dom = template.clone();

    
    return dom;
  }

  unrender() {

  }

}
