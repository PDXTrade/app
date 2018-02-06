
import Template from '../../Template';
import html from './item-list.html';
import './item-list.css';
import { db } from '../../../services/firebase';

const template = new Template(html);

export default class ItemList {
  constructor(list) {
    this.list = list;
  }

  render() {
    const dom = template.clone(); 
    


    return dom;
  
  }
}