import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication cookies
    const hasTempAuth = document.cookie.includes('tempAuth=');
    const hasToken = document.cookie.includes('token=');

    // If no authorization, redirect to login page
    if (!hasTempAuth && !hasToken) {
      router.push('/admin/simple-login');
    } else {
      // If authorized, redirect to the admin panel
      router.push('/admin');
    }
  }, [router]);

  return (
    <div className={styles.redirectPage}>
      <div className={styles.redirectContainer}>
        <h1>Redirecting...</h1>
        <div className="loading-spinner"></div>
        <p>Please wait. You will be redirected to the appropriate page.</p>
        <div className={styles.redirectLinks}>
          <a href="/admin/simple-login">Go to login page</a>
          <a href="/admin">Go to admin panel</a>
        </div>
      </div>
    </div>
  );
} 