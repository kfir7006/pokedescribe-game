import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAxhDvJnlB9QHxCNKsPFPGEyRabaLNZeDU",
  authDomain: "pokedescribe-game.firebaseapp.com",
  databaseURL: "https://pokedescribe-game-default-rtdb.firebaseio.com",
  projectId: "pokedescribe-game",
  storageBucket: "pokedescribe-game.firebasestorage.app",
  messagingSenderId: "8250502072",
  appId: "1:8250502072:web:086a7ea583fb14ba067d4d"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export { ref, set, get, onValue, remove };