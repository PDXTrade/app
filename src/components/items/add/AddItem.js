import Template from '../../Template';
import html from './add-item.html';
import './add-item.css';


const template = new Template(html);

export default class AddItem {
  constructor(onAdd) {
    this.onAdd = onAdd;
  }

  render() {
    const dom = template.clone();

    
    return dom;
  }

  unrender() {

  }

}
