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
    // Pay attention to eslint and remove unused items
    const chevron = dom.querySelector('#category-accordian span');
    const categoryNav = dom.querySelector('#category-nav');
    
    chevron.addEventListener('click', (event) => {
      event.preventDefault(); // I don't believe this is needed. What is default for a span click?
      // a bit odd to toggle three different classes.
      // Try and use one on a common parent.
      // (and use :not() for specific styles to apply in reverse case)
      chevron.classList.toggle('clicked');
      categoryNav.classList.toggle('show');
      categoryNav.classList.toggle('hide');
    });
    
    auth.onAuthStateChanged(user => {
      let child = null;
      if(user) {
        child = new User().render();
      }
      else {
        child = document.createElement('a');
        child.innerHTML = '<span class="fa fa-user"></span> Login';
        child.href = '#login';
      }

      removeChildren(userItem);
      userItem.appendChild(child);
    });

    // Don't Repeat Yourself (DRY)
    categoryNav.appendChild(new Categories().render());

    return dom;
  }
} 
