import html from './categories.html';
import Template from '../../Template';
// import { db } from '../../../services/firebase';

const template = new Template(html);
// const categoriesDB = db.ref('categories');

export default class User {

  render() {
    const dom = template.clone();
    const categories = dom.querySelector('ul');

    categories.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = `#home/${event.target.textContent}`;
    });

    return dom;
  }
}