import html from './header.html';
import Template from '../../Template';
import './header.css';

const template = new Template(html);

export default class Header {

  render() {
    const dom = template.clone();

    return dom;
  }
}