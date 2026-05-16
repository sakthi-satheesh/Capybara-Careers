import authManager from './authManager.js';

const inputs = document.querySelectorAll('.rectangle');
const submitButton = document.getElementById('submit');

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const toggleButton = document.getElementById('toggle');
const toggleButton2 = document.getElementById('toggle2');

const eyeIcon = toggleButton.querySelector('.element');
const eyeIcon2 = toggleButton2.querySelector('.element');

submitButton.addEventListener('click', function(event) {
  event.preventDefault();

  if (!authManager.validateInputs(inputs)) {
    alert('Please fill out all provided boxes!');
    return;
  }

  if (!authManager.passwordsMatch(passwordInput.value, confirmPasswordInput.value)) {
    alert('Passwords need to match!');
    return;
  }

const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggle');
const eyeIcon = toggleButton.querySelector('.element');

//toggling the password text to be visible
toggleButton.addEventListener('click', function() {
  // Check the current type of the first password field
  const isHidden = passwordInput.type === 'password';

  // Toggle the type attribute based on current state
  passwordInput.type = isHidden ? 'text' : 'password';

  //update the button text indicator
  eyeIcon.src = isHidden ? '../images/opened_eye.png' : '../images/closed_eye.png';
  eyeIcon.alt = isHidden ? 'Closed Eye Icon' : 'Open Eye Icon';
});

toggleButton2.addEventListener('click', function() {
  const isHiddenConfirm = confirmPasswordInput.type === 'password';

  confirmPasswordInput.type = isHiddenConfirm ? 'text' : 'password';

  eyeIcon2.src = isHiddenConfirm ? '../images/opened_eye.png' : '../images/closed_eye.png';
  eyeIcon2.alt = isHiddenConfirm ? 'Open Eye Icon' : 'Closed Eye Icon';
});