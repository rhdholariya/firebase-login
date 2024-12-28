// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBvQuZnJmRY1NORsCzUdgCsQWFbEF-hrtc",
    authDomain: "test-project-b0ad7.firebaseapp.com",
    projectId: "test-project-b0ad7",
    storageBucket: "test-project-b0ad7.firebasestorage.app",
    messagingSenderId: "870562754295",
    appId: "1:870562754295:web:5e050dc7deaca9610d2df2",
    measurementId: "G-LJLYJ3GPH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (localStorage.getItem('loggedInUserId') && localStorage.getItem('firebaseToken')) {
    window.location.href = 'dashboard.html';
}

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();
    signUp.querySelector('.loader-icon').style.display = 'inline-block';
    signUp.disabled = true;
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const token = await user.getIdToken();
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                token: token
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("error writing document", error);

                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('unable to create User', 'signUpMessage');
            }
            signUp.querySelector('.loader-icon').style.display = 'none';
            signUp.disabled = false;
        })
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();
    signIn.querySelector('.loader-icon').style.display = 'inline-block';
    signIn.disabled = true;
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            showMessage('login is successful', 'signInMessage');
            const user = userCredential.user;
            const token = await user.getIdToken();
            localStorage.setItem('loggedInUserId', user.uid);
            localStorage.setItem('firebaseToken', token);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
            signIn.querySelector('.loader-icon').style.display = 'none';
            signIn.disabled = false;
        });

})