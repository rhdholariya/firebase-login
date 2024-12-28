
function isTokenExpired(token) {
    if (!token) return true; // If no token, consider it expired
    const decoded = decodeJWT(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime; // Compare current time with token expiry
}

function decodeJWT(token) {
    const payload = token.split('.')[1]; // Get the payload part of the token
    return JSON.parse(atob(payload)); // Decode from Base64
}

const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

if(signUpButton){
    signUpButton.addEventListener('click',function(){
        signInForm.style.display="none";
        signUpForm.style.display="block";
    });
}

if(signInButton){
    signInButton.addEventListener('click', function(){
        signInForm.style.display="block";
        signUpForm.style.display="none";
    });
}
