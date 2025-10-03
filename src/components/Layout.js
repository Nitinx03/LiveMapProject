import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  
  // ไม่แสดง Navbar ในหน้า Login
  const showNavbar = router.pathname !== '/';

  return (
    <div className={styles.container}>
      {showNavbar && <Navbar />}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}