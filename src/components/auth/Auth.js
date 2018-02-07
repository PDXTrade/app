import Template from '../Template';
import html from './auth.html';
import { auth, providers, db } from '../../services/firebase';
import firebaseui from 'firebaseui';

const ui = new firebaseui.auth.AuthUI(auth);
const users = db.ref('users');
const template = new Template(html);

export default class Auth {

  constructor(){
    const routes = window.location.hash.split('/');
    this.redirect = decodeURIComponent(routes[1] || '#');
  }

  render() {

    const dom = template.clone();


    setTimeout(() => {
      const { origin, pathname } = window.location;
      ui.start('#auth-container', {
        signInSuccessUrl: `${origin}${pathname}${this.redirect}`,
        signInOptions: [
          providers.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccess(user) {
            users.child(user.uid).set({ name: user.displayName });
            return true;
          }, 
        },  
        credentialHelper: firebaseui.auth.CredentialHelper.NONE
      });
      
    });

    return dom;
  }

  unrender() {
  }

}