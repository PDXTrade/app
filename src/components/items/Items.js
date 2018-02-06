import Template from '../Template';
import html from './items.html';
import './items.css';
import ItemList from './list/ItemList';
// import AddItem from './add/AddItem';

import { removeChildren } from '../dom';


const template = new Template(html);

export default class Items {
  contructor(){
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childComponent === childPage) return;
   
    this.childPage = childPage;
    if(this.childComponent) this.childComponent.unrender();
    removeChildren(this.section);

    let childComponent;
    if(childPage === 'add') childComponent = new AddItem();
    else if(childPage) childComponent = new ItemDetail(childPage);
    else childComponent = new ItemList();
    
    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());
  }

  render() {
    const dom = template.clone();
    this.section = dom.querySelector('section');
    this.setChildPage();
    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashchange);
  }

}