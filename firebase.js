import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD4Z4N_Y1prkET--pNWJHDqnC46or4UIuI",
    authDomain: "testcrud-9899f.firebaseapp.com",
    projectId: "testcrud-9899f",
    storageBucket: "testcrud-9899f.firebasestorage.app",
    messagingSenderId: "698707657855",
    appId: "1:698707657855:web:9cd44f1145329b3f72eb4a",
    measurementId: "G-1HR8TGWVS4"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db };
