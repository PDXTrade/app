import html from './user.html';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class User {

  render() {
    const dom = template.clone();
    const user = auth.currentUser;

    dom.querySelector('.user-name').textContent = user.displayName;
    if(user.photoURL) dom.querySelector('.profile').src = user.photoURL;

    dom.querySelector('.sign-out').addEventListener('click', () => {
      auth.signOut();
    });

    return dom;
  }
}