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

  const firstName = document.querySelector('.firstName input').value;
  const lastName = document.querySelector('.lastName input').value;
  const email = document.querySelector('.emailBox input').value;

  const fullName = firstName + " " + lastName;

  localStorage.setItem("userName", fullName);
  localStorage.setItem("userEmail", email);

  authManager.login(fullName);
  authManager.redirect('Logged_In.html');
});

toggleButton.addEventListener('click', function() {
  const isHidden = passwordInput.type === 'password';

  passwordInput.type = isHidden ? 'text' : 'password';

  eyeIcon.src = isHidden ? '../images/opened_eye.png' : '../images/closed_eye.png';
  eyeIcon.alt = isHidden ? 'Open Eye Icon' : 'Closed Eye Icon';
});

toggleButton2.addEventListener('click', function() {
  const isHiddenConfirm = confirmPasswordInput.type === 'password';

  confirmPasswordInput.type = isHiddenConfirm ? 'text' : 'password';

  eyeIcon2.src = isHiddenConfirm ? '../images/opened_eye.png' : '../images/closed_eye.png';
  eyeIcon2.alt = isHiddenConfirm ? 'Open Eye Icon' : 'Closed Eye Icon';
});