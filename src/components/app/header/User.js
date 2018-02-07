import html from './user.html';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class User {

  render() {
    const dom = template.clone();
    const user = auth.currentUser;

    dom.querySelector('.user-name').textContent = `Hi, ${user.displayName}`;

    dom.querySelector('.sign-out').addEventListener('click', () => {
      auth.signOut();
    });

    const userLink = dom.querySelector('#user-link');
    const userID = auth.currentUser.uid;
    userLink.href = `#user/${userID}`;

    return dom;
  }
}