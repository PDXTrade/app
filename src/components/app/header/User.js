import html from './user.html';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class User {

  render() {
    const dom = template.clone();
    // Try not to mix styles of using variable or not using variables
    // or using variables and then re-accessing same property on object.
    // Be consistent!

    // Declare the properties we need using destructuring
    const { uid, displayName } = auth.currentUser;

    // Find and set DOM nodes. In this case, we only need to do one thing
    // to each node, so no variables (though you could);
    dom.querySelector('.user-name').textContent = `hi, ${displayName}`;
    dom.querySelector('#user-link').href = `#user/${uid}`;
    dom.querySelector('#trades-link').href = `#tradeview/${uid}`;
    dom.querySelector('.sign-out').addEventListener('click', () => {
      auth.signOut().then(() => window.location.hash = 'items');
    });

    return dom;
  }
}