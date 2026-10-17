import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import defaultConfig from '../../firebase-applet-config.json';


export const customFirebaseConfig = {
  apiKey: defaultConfig.apiKey || "",
  authDomain: defaultConfig.authDomain || "",
  projectId: defaultConfig.projectId || "",
  storageBucket: defaultConfig.storageBucket || "",
  messagingSenderId: defaultConfig.messagingSenderId || "",
  appId: defaultConfig.appId || "",
};

export const app: FirebaseApp = getApps().length === 0
  ? initializeApp(customFirebaseConfig)
  : getApp();

export const auth: Auth = getAuth(app);

export const db: Firestore = getFirestore(app);

export const firebaseConfig = customFirebaseConfig;
