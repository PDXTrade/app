import html from './header.html';
import Template from '../../Template';
import './header.css';
import User from './User';
import { auth } from '../../../services/firebase';
import { removeChildren } from '../../dom';
import Categories from './Categories';

const template = new Template(html);

export default class Header {

  render() {
    const dom = template.clone();
    const userItem = dom.querySelector('.user-nav');
    const tradesLink = dom.querySelector('#trades-link');
    const categories = dom.querySelector('#category-accordian');

    // categories.addEventListener('click', (event) => {

    auth.onAuthStateChanged(user => {
      let child = null;
      if(user) {
        child = new User().render();
      }
      else {
        child = document.createElement('a');
        child.innerHTML = '<span class="fa fa-user"></span> Login';
        child.href = '#login';
        userItem.appendChild(child);
        tradesLink.classList.add('hidden');
        
      }

      removeChildren(userItem);
      userItem.appendChild(child);
    });

    // dom.querySelector('#category-nav').appendChild(new Categories().render());

    return dom;
  }
}