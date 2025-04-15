import { useState } from 'react';
import styles from '../../styles/AdminLogin.module.css';

const SimpleLogin: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side login and password verification
    // In a real application, this should be done on the server
    if (username === 'admin' && password === 'ecocraft2023') {
      setLoginSuccess(true);
      
      // Set temporary cookie manually
      document.cookie = 'tempAuth=true; path=/; max-age=3600';
      
      // Delay for showing success message
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Simple Admin Login</h1>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {loginSuccess && (
          <div className={styles.successMessage}>
            Login successful! Redirecting to admin page...
          </div>
        )}
        
        {!loginSuccess && (
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        )}
        
        {loginSuccess && (
          <div className={styles.manualRedirect}>
            <p>If automatic redirection doesn't work, click the button below:</p>
            <a href="/admin" className={styles.redirectButton}>
              Go to admin page
            </a>
          </div>
        )}
        
        <div className={styles.hintContainer}>
          <p>Username: admin</p>
          <p>Password: ecocraft2023</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin; 