import React, { useState } from 'react';

const LoginModal = ({ open, onClose, onLogin, onSignup }) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTooltip, setPasswordTooltip] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  if (!open) {
    return null;
  }

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay') && open) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordTooltip('');
    setLoginError('');
    setSignupError('');
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    const hasNumber = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);

    if (pass.length >= 8 && hasNumber && hasUpper && hasLower) {
      setPasswordTooltip('Password is strong');
    } else {
      setPasswordTooltip('Password must be at least 8 characters, and include numbers, uppercase, and lowercase letters');
    }
  };

  const handleSignup = () => {
    // Basic validation for sign-up
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSignupError('Invalid email format');
      return;
    }
    if (passwordTooltip !== 'Password is strong') {
      setSignupError('Weak password');
      return;
    }
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    // If all validations pass, call the onSignup function
    onSignup({ username, email, password });
    resetForm();
    onClose();
  };

  const handleLogin = () => {
    // Basic validation for login
    if (!username || !password) {
      setLoginError('Username and password are required');
      return;
    }

    // Call the onLogin function
    onLogin({ username, password });
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal">
        <h2>{showLoginForm ? 'Login' : 'Sign Up'}</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div>
          <button onClick={onLogin}>Log in</button>
          <button onClick={onSignup}>Sign up</button>
          
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
