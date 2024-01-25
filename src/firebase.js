import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/functions'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Credenciales para conectarse a firebase
const firebaseConfig = {
    apiKey: "AIzaSyBR7aKFazgKV3QokmGLm_lxhF4r48-EP74",
    authDomain: "sistema-solicitudes-aulas.firebaseapp.com",
    projectId: "sistema-solicitudes-aulas",
    storageBucket: "sistema-solicitudes-aulas.appspot.com",
    messagingSenderId: "948402829062",
    appId: "1:948402829062:web:2736482e91f2c1b6f59087",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = firebase.storage()
const db = firebase.firestore()
const functions = firebase.functions()
export { db, auth, firebase, functions, storage } 