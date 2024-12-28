import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc ,updateDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

const auth=getAuth();
const db=getFirestore();

auth.onAuthStateChanged(async (user) => {
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    const firebaseToken=localStorage.getItem('firebaseToken');
    if(loggedInUserId && firebaseToken){
        const userRef = doc(db, "users", loggedInUserId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData= userDoc.data();
            const { token } = userDoc.data();
            await checkAndUpdateToken(user.uid, token);
            document.getElementById('loggedUserFName').innerText=userData.firstName;
            document.getElementById('loggedUserEmail').innerText=userData.email;
            document.getElementById('loggedUserLName').innerText=userData.lastName;
        } else {
            console.error('User document not found.');
        }
    } else{
        window.location.href='index.html';
        console.log("User Id not Found in Local storage")
    }
})

async function checkAndUpdateToken(uid, token) {
    try {
        // Check if the token is expired
        if (isTokenExpired(token)) {
            console.log('Token expired. Refreshing...');

            // Get a fresh token
            const user = auth.currentUser;
            if (!user) {
                console.error('No authenticated user found.');
                return;
            }
            const newToken = await user.getIdToken(true);

            // Update the token in Firestore
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { token: newToken });

            console.log('Token refreshed and updated in Firestore.');
        } else {
            console.log('Token is still valid.');
        }
    } catch (error) {
        console.error('Error checking or refreshing token:', error);
    }
}

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('firebaseToken');
    signOut(auth)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error('Error Signing out:', error);
        })
})