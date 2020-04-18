import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDUjoownQ2PtLf0yIIGSSZdgjgLSWT2muQ",
  authDomain: "new-shopping-cart-3e657.firebaseapp.com",
  databaseURL: "https://new-shopping-cart-3e657.firebaseio.com",
  projectId: "new-shopping-cart-3e657",
  storageBucket: "new-shopping-cart-3e657.appspot.com",
  messagingSenderId: "961078311480",
  appId: "1:961078311480:web:58dc911f52631083fd04cd",
  measurementId: "G-QT85J2D1D1"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
