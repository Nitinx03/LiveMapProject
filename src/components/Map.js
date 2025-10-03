import { useEffect, useRef } from 'react';
import styles from '../styles/Map.module.css';

export default function MapComponent({ posts, userLocation }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับโหลด Google Maps
    const loadGoogleMaps = () => {
      // ในขั้นตอนพัฒนา เราจะใช้ div ธรรมดาก่อน
      // เมื่อพร้อมแล้วค่อยเพิ่ม Google Maps API
      console.log('Google Maps would be loaded here');
    };

    loadGoogleMaps();
  }, [posts, userLocation]);

  return (
    <div ref={mapRef} className={styles.map}>
      {/* แผนที่จำลองสำหรับการพัฒนา */}
      <div style={{
        width: '100%',
        height: '100%',
        background: '#e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <p>แผนที่มหาวิทยาลัยแม่โจ้</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            {userLocation 
              ? `ตำแหน่งปัจจุบัน: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
              : 'กำลังดึงตำแหน่ง...'
            }
          </p>
          <div style={{ marginTop: '20px' }}>
            <p>โพสต์ทั้งหมด: {posts.length} โพสต์</p>
          </div>
        </div>
      </div>
    </div>
  );
}