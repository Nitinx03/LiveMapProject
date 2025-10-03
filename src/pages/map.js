import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import MapComponent from '../components/Map';
import FilterPanel from '../components/FilterPanel';
import styles from '../styles/Map.module.css';

export default function MapPage() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    general: true,
    buildings: true,
    restaurants: true,
    accidents: true
  });
  const [userLocation, setUserLocation] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบการล็อกอิน
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // ดึงตำแหน่งปัจจุบันของผู้ใช้
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // ตั้งค่าเริ่มต้นเป็นตำแหน่งมหาวิทยาลัยแม่โจ้
          setUserLocation({ lat: 18.8974, lng: 99.0130 });
        }
      );
    }

    // โหลดโพสต์จากฐานข้อมูล (จำลองข้อมูล)
    loadPosts();
  }, [router]);

  const loadPosts = () => {
    // จำลองการโหลดโพสต์จากฐานข้อมูล
    const mockPosts = [
      {
        id: 1,
        title: "ร้านอาหารใต้ตึกวิทย์ไม่เปิดวันนี้",
        content: "ร้านอาหารใต้ตึกคณะวิทยาศาสตร์ปิดทำการวันนี้ เนื่องจากเจ้าของลาป่วย",
        type: "restaurants",
        location: { lat: 18.8978, lng: 99.0135 },
        author: "นักศึกษาวิทยาศาสตร์",
        timestamp: new Date(),
        image: "/images/restaurant-closed.jpg",
        likes: 15,
        comments: 3
      },
      {
        id: 2,
        title: "อุบัติเหตุบริเวณลานจอดรถ",
        content: "มีรถชนกันบริเวณลานจอดรถด้านหลังตึกบริหาร เจ้าหน้าที่กำลังจัดการอยู่",
        type: "accidents",
        location: { lat: 18.8965, lng: 99.0128 },
        author: "นักศึกษาบริหาร",
        timestamp: new Date(),
        image: "/images/accident.jpg",
        likes: 8,
        comments: 5
      }
    ];
    setPosts(mockPosts);
  };

  const filteredPosts = posts.filter(post => filters[post.type]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mapContainer}>
          <MapComponent 
            posts={filteredPosts} 
            userLocation={userLocation}
          />
        </div>
        
        <FilterPanel 
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </Layout>
  );
}