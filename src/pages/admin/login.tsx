import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/AdminLogin.module.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successLogin, setSuccessLogin] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const router = useRouter();
  
  // Use useEffect for redirection after successful login
  useEffect(() => {
    if (successLogin) {
      setDebugInfo(prev => `${prev}\nAttempting to redirect through window.location...`);
      // Use direct redirection through window.location as a fallback
      window.location.href = '/admin';
    }
  }, [successLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setLoading(true);
    setSuccessLogin(false);

    try {
      setDebugInfo('Sending request...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      setDebugInfo(`Response received: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setDebugInfo(prev => `${prev}\nServer response: ${JSON.stringify(data)}`);

      if (res.ok) {
        setDebugInfo(prev => `${prev}\nSuccessful login, trying to redirect via Next.js router...`);
        
        try {
          // First try to use Next.js router
          await router.push('/admin');
          setDebugInfo(prev => `${prev}\nRouter.push executed, but redirection did not occur.`);
        } catch (routerError) {
          setDebugInfo(prev => `${prev}\nError using router.push: ${routerError}`);
        }
        
        // If router.push didn't work, set successLogin to trigger redirection via window.location
        setSuccessLogin(true);
        
      } else {
        setLoading(false);
        setError(data.message || 'Login error');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      setError(`Server error. Please try again later. ${error instanceof Error ? error.message : ''}`);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Admin Login</h1>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading && <div className={styles.loadingMessage}>Loading...</div>}
        {successLogin && <div className={styles.successMessage}>Login successful! Redirecting...</div>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading || successLogin}
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
              disabled={loading || successLogin}
            />
          </div>
          
          <button type="submit" className={styles.loginButton} disabled={loading || successLogin}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {successLogin && (
          <div className={styles.manualRedirect}>
            <p>If automatic redirection doesn't work, click the button below:</p>
            <a href="/admin" className={styles.redirectButton}>Go to admin page</a>
          </div>
        )}

        {/* Debug information - remove in production */}
        {debugInfo && (
          <div className={styles.debugInfo}>
            <h3>Details:</h3>
            <pre>{debugInfo}</pre>
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

export default Login; 