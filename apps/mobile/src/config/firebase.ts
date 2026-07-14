import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase env:', {
  apiKeyLoaded: Boolean(firebaseConfig.apiKey),
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appIdLoaded: Boolean(firebaseConfig.appId),
});

if (!firebaseConfig.apiKey) {
  throw new Error('EXPO_PUBLIC_FIREBASE_API_KEY chưa được tải.');
}

const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseApp;