
import Template from '../../Template';
import html from './item-list.html';
import './item-list.css';
// import Item from './Item';
import { db } from '../../../services/firebase';

const template = new Template(html);

export default class ItemList {
  
  render() {
    const dom = template.clone(); 
    


    return dom;
  
  }
}