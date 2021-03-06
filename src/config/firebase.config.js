import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCLi02L4eDGEUJXwtnjrW2aOcx6Jx8tyd0',
  authDomain: 'app-professor-match.firebaseapp.com',
  projectId: 'app-professor-match',
  storageBucket: 'app-professor-match.appspot.com',
  messagingSenderId: '909432139541',
  appId: '1:909432139541:web:847b2ffa08f38a9b26031c',
};

const firebaseApp = initializeApp(firebaseConfig);
// firebase.analytics();
// export const storage = firebase.app().storage('gs://int-ecommerce.appspot.com');
export const storage = getStorage(firebaseApp);
