import Template from '../Template';
import html from './trades-view-list.html';
import { auth, db } from '../../services/firebase';

const tradesByUser = db.ref('tradesByUser');
const template = new Template(html);

export default class Auth {

  constructor(listRef){
    this.listRef = listRef;
  }

  render() {

    const dom = template.clone();
    const ul = dom.querySelector('ul');

    const myTrades = tradesByUser.child(auth.currentUser.uid);
    // const tradesList = new TradesViewList(myTrades);

    // ul.appendChild(tradesList);

    return dom;
  }

  unrender() {
  }

}