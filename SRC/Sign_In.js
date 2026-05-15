const inputs = document.querySelectorAll('.rectangle');
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', function(event) {
  event.preventDefault();

  //initialize the condition
  let allValid = true;

  inputs.forEach(input => {
      //if any input is empty, change condition to false
      if (input.value.trim() === '') {
        allValid = false;
      }
    });

  //check if all inputs were provided
  if (!allValid) {
    alert('Please fill out all provided boxes!');
    return;
  }

  //go to next page
  window.location.href = 'Dashboard.html';

});

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