import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // จำลองการล็อกอิน (ในโปรเจคจริงจะเชื่อมต่อกับ API)
    try {
      // ตรวจสอบข้อมูลล็อกอิน
      if (username && password) {
        // บันทึกข้อมูลการล็อกอิน (ในโปรเจคจริงจะใช้ session หรือ token)
        localStorage.setItem('user', JSON.stringify({ username }));
        router.push('/map');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThaiIDLogin = () => {
    // ฟังก์ชันสำหรับล็อกอินด้วย ThaiID
    alert('ระบบล็อกอินด้วย ThaiID กำลังพัฒนา');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>Maejo Community</h1>
          <p>แอปชุมชนมหาวิทยาลัยแม่โจ้</p>
        </div>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'กำลังล็อกอิน...' : 'ล็อกอิน'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>หรือ</span>
        </div>
        
        <button 
          onClick={handleThaiIDLogin}
          className={styles.thaiIdButton}
        >
          ล็อกอินด้วย ThaiID
        </button>
        
        <div className={styles.footer}>
          <p>สำหรับนักศึกษาและบุคลากรมหาวิทยาลัยแม่โจ้</p>
        </div>
      </div>
    </div>
  );
}