class AuthManager {
  constructor() {
    // Prevent multiple instances
    if (AuthManager.instance) {
      return AuthManager.instance;
    }

    this.currentUser = null;

    AuthManager.instance = this;
  }

  validateInputs(inputs) {
    for (let input of inputs) {
      if (input.value.trim() === '') {
        return false;
      }
    }

    return true;
  }

  passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  login(username) {
    this.currentUser = username;
    console.log(`${username} signed in`);
  }

  logout() {
    this.currentUser = null;
  }

  redirect(page) {
    window.location.href = page;
  }
}

// Export ONE instance
const authManager = new AuthManager();

export default authManager;