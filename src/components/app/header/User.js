import html from './user.html';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class User {

  render() {
    const dom = template.clone();
    const user = auth.currentUser;

    dom.querySelector('.user-name').textContent = `hi, ${user.displayName}`;

    dom.querySelector('.sign-out').addEventListener('click', () => {
      auth.signOut()
        .then(() => window.location.hash = 'items');
    });

    const userLink = dom.querySelector('#user-link');
    const tradesLink = dom.querySelector('#trades-link');
    const userID = auth.currentUser.uid;
    userLink.href = `#user/${userID}`;
    tradesLink.href = `#tradeview/${userID}`;

    return dom;
  }
}