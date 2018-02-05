import html from './header.html';
import Template from '../../Template';
import './header.css';
import User from './User';
import { auth } from '../../../services/firebase';
import { removeChildren } from '../../dom';

const template = new Template(html);

export default class Header {

  render() {
    const dom = template.clone();
    const userItem = dom.querySelector('.user-nav');

    auth.onAuthStateChanged(user => {
      let child = null;

      if(user) {
        child = new User().render();
      }
      else {
        child = document.createElement('a');
        child.textContent = 'Sign In';
        child.href = '#auth';
        userItem.appendChild(child);
      }

      removeChildren(userItem);
      userItem.appendChild(child);
    });

    return dom;
  }
}