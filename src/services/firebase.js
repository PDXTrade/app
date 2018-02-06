import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBe_-OqBKBHBBSv3vOt9_N9pJVKBtvAA20",
  authDomain: "tradepdx-6f568.firebaseapp.com",
  databaseURL: "https://tradepdx-6f568.firebaseio.com",
  projectId: "tradepdx-6f568",
  storageBucket: "",
  messagingSenderId: "250899403871"
};

const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database(); //the real-time database
export const storage = firebase.storage(); //the firebase storage adjunct for images
export const auth = firebaseApp.auth(); //the firebase auth namespace

export const providers = firebase.auth;
