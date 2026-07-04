import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "weighty-calculus-ddzcr",
  appId: "1:675996307453:web:7cf74cb299daffba861394",
  apiKey: "AIzaSyAYoZ1sfAsiS2T-vFDjzt_Yy94H4dRI2y4",
  authDomain: "weighty-calculus-ddzcr.firebaseapp.com",
  storageBucket: "weighty-calculus-ddzcr.firebasestorage.app",
  messagingSenderId: "675996307453"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom settings (force long polling for stable connection in sandboxed preview) and custom database ID
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-nfrtdigitalmenu-7e34f2d6-8be8-4824-9a37-04af7565bd07");
