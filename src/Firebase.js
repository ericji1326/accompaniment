import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdFmTsV4GeCRfLQqErsJZw3S8kBznQ-gc",
  authDomain: "sounds-like-love.firebaseapp.com",
  projectId: "sounds-like-love",
  storageBucket: "sounds-like-love.appspot.com",
  messagingSenderId: "183586822563",
  appId: "1:183586822563:web:658bdf94aa268ba1e0e216",
  measurementId: "G-H871JWRN59",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create a Google O-Auth and Allow User to Pick Google Account (instead of defaulting to logged in account)
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Sign In With Google
async function signInWithGoogle() {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    // Query Database to check if user is in database (uid)
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    // If user does not exist, make a new record in database for new user
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// If this function runs, we already know user is registered in database
async function loginWithEmailAndPassword(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function registerWithEmailAndPassword(name, email, password) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password Reset Link Sent");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

function logout() {
  signOut(auth);
}

export {
  auth,
  db,
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
