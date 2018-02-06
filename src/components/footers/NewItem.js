import html from './new-item.html';
import Template from '../../Template';
import './footers.css';
import { removeChildren } from '../../dom';

const template = new Template(html);

export default class NewItem {

  render() {
    const dom = template.clone();

    return dom;
  }
}