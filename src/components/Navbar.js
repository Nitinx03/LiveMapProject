import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navItems}>
        <button 
          className={`${styles.navItem} ${router.pathname === '/map' ? styles.active : ''}`}
          onClick={() => router.push('/map')}
        >
          <span className={styles.icon}>🗺️</span>
          <span className={styles.label}>แผนที่</span>
        </button>
        
        <button 
          className={`${styles.navItem} ${router.pathname === '/posts' ? styles.active : ''}`}
          onClick={() => router.push('/posts')}
        >
          <span className={styles.icon}>📝</span>
          <span className={styles.label}>โพสต์</span>
        </button>
        
        <button 
          className={`${styles.navItem} ${router.pathname === '/create-post' ? styles.active : ''}`}
          onClick={() => router.push('/create-post')}
        >
          <span className={styles.icon}>+</span>
          <span className={styles.label}>สร้างโพสต์</span>
        </button>
        
        <button 
          className={`${styles.navItem} ${router.pathname === '/account' ? styles.active : ''}`}
          onClick={() => router.push('/account')}
        >
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>บัญชี</span>
        </button>
      </div>
    </nav>
  );
}