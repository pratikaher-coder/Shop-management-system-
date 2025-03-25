// User accounts storage
const users = JSON.parse(localStorage.getItem('shopUsers')) || [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

// Switch between login/signup forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

// Login Functionality
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect to main app
        window.location.href = 'index.html';
    } else {
        showError('Invalid username or password');
    }
});

// Signup Functionality
signupBtn.addEventListener('click', () => {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.username === username)) {
        showError('Username already exists');
        return;
    }
    
    const newUser = {
        username,
        password, // Note: In production, you should hash passwords!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('shopUsers', JSON.stringify(users));
    showError('Account created successfully!', 'success');
    
    // Auto-login after signup
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    setTimeout(() => window.location.href = 'index.html', 1000);
});

// Helper function to show error/success messages
function showError(message, type = 'error') {
    const errorDiv = document.createElement('div');
    errorDiv.className = `error-message ${type}`;
    errorDiv.textContent = message;
    
    // Remove existing messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Add new message
    const activeForm = loginForm.style.display !== 'none' ? loginForm : signupForm;
    activeForm.appendChild(errorDiv);
    
    if (type === 'success') {
        setTimeout(() => errorDiv.remove(), 3000);
    }
}
