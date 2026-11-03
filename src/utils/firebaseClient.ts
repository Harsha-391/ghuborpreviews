// The Firebase functions public pages use, as named re-exports so the bundler
// can tree-shake the rest of the SDK. Loaded on demand via utils/loadFirebase:
// importing a whole SDK namespace (`import("firebase/firestore")`) would ship
// all of it. Add an export here before using a new Firebase function lazily.
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
export { doc, getDoc, setDoc } from "firebase/firestore";
export { auth, db } from "./firebase";
