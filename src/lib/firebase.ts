import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAM3jdJaan9QAHTndVbb2kheXBz2Plr1vE',
  authDomain: 'pfpe-7da61.firebaseapp.com',
  projectId: 'pfpe-7da61',
  storageBucket: 'pfpe-7da61.firebasestorage.app',
  messagingSenderId: '574239393075',
  appId: '1:574239393075:web:7f6ead1ecffbdd8ca76a46',
  measurementId: 'G-8753TXL8GS',
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const auth: Auth = getAuth(firebaseApp);
