require("dotenv").config();

const inputs = document.querySelectorAll('.rectangle');
const submitButton = document.getElementById('submit');

// ================================
// SIGN IN
// ================================
submitButton.addEventListener('click', async function(event) {

    event.preventDefault();

    // initialize validation condition
    let allValid = true;

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allValid = false;
        }
    });

    // validation check
    if (!allValid) {
        alert('Please fill out all provided boxes!');
        return;
    }

    // get form values
    const email =
        document.querySelector('.emailBox input').value;

    const password =
        document.getElementById('password').value;

    try {

        // send login request to backend
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Login failed');
            return;
        }

        // create username from email
        const username = email.split('@')[0];

        // save user info locally
        localStorage.setItem("userName", username);
});
