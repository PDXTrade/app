import Template from '../Template';
import html from './trade.html';
import './trade.css';
import UserPage from '../user/UserPage';
import { db } from '../../services/firebase';

const template = new Template(html);

export default class Trade {

  render() {
    const dom = template.clone();
  

    
    return dom;
  }

  unrender() {
    // window.removeEventListener('hashchange', this.hashChange);
  }
}
