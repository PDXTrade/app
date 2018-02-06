import Template from '../Template';
import html from './app.html';
import './app.css';
import { removeChildren } from '../dom';
import Auth from '../auth/Auth';
import Header from './header/Header';
import Items from '../items/Items';
// import Items from '../items/Items';
import { auth } from '../../services/firebase';

const template = new Template(html);

const map = new Map();
map.set('#login', { Component: Auth, isPublic: true });
map.set('#items', { Component: Items, isPublic: true });

const homepage = { Component: Items, isPublic: true };

export default class App {

  constructor() {
    window.onhashchange = () => this.setPage();
    window.addEventListener('hashchange', this.hashChange); 

    let authed = false;

    auth.onAuthStateChanged(user => {
      this.user = user;
      if(!authed) {
        authed = true;
        this.setPage();
      }
      if(!user && !this.page.isPublic) {
        window.location.hash = '#';
      }
    });
  }

  setPage() {
    const { hash } = window.location;
    const routes = hash.split('/');
    const route = routes[0];
    
    if(this.page && route === this.page.route) return;

    if(this.page && this.page.component) this.page.component.unrender();
    removeChildren(this.main);

    const { Component, isPublic } = map.get(route) || homepage;

    let component = null;

    if(!isPublic && !this.user) {
      window.location.hash = `#login/${encodedURIComponent(hash)}`;
    }
    else {
      component = new Component();
      this.page = { route, component, isPublic };
      this.main.appendChild(component.render());
    }
  }

  render() {
    const dom = template.clone();   

    dom.querySelector('header').appendChild(new Header().render());

    this.footer = dom.querySelector('#footer');
    this.header = dom.querySelector('#header');
    this.main = dom.querySelector('main');
    this.setPage();

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  } 
}
