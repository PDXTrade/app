import html from './categories.html';
import Template from '../../Template';

const template = new Template(html);

export default class User {

  render() {
    return template.clone();
  }
}