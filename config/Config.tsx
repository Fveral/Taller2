import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBY_V4CyZ9yGJa2q5eYp6APcoSIeVKdcqE",
  authDomain: "mascotas-7e734.firebaseapp.com",
  projectId: "mascotas-7e734",
  storageBucket: "mascotas-7e734.appspot.com",
  messagingSenderId: "71151036857",
  appId: "1:71151036857:web:e4f4754c3396e60182ee68"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getDatabase(app);