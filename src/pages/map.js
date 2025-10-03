import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import styles from '../styles/Map.module.css';
import dynamic from 'next/dynamic';

// Dynamic import สำหรับ MapComponent
const MapComponent = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Loading map...</div>
    </div>
  )
});

export default function MapPage() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    general: true,
    buildings: true,
    restaurants: true,
    accidents: true
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ตั้งค่า client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient, router]);

  const loadPosts = () => {
    // จำลองข้อมูลโพสต์ในมหาวิทยาลัยแม่โจ้
    const mockPosts = [
      {
        id: 1,
        title: "ร้านอาหารใต้ตึกวิทย์ไม่เปิดวันนี้",
        content: "ร้านอาหารใต้ตึกคณะวิทยาศาสตร์ปิดทำการวันนี้ เนื่องจากเจ้าของลาป่วย แนะนำให้ไปที่โรงอาหารกลางแทน",
        type: "restaurants",
        location: { lat: 18.8978, lng: 99.0135 },
        author: "นักศึกษาวิทยาศาสตร์",
        timestamp: new Date('2024-01-15T10:30:00'),
        image: "/images/restaurant-closed.jpg",
        likes: 15,
        comments: 3
      },
      {
        id: 2,
        title: "อุบัติเหตุบริเวณลานจอดรถ",
        content: "มีรถชนกันบริเวณลานจอดรถด้านหลังตึกบริหาร เจ้าหน้าที่กำลังจัดการอยู่ โปรดใช้เส้นทางอื่น",
        type: "accidents",
        location: { lat: 18.8965, lng: 99.0128 },
        author: "นักศึกษาบริหาร",
        timestamp: new Date('2024-01-15T09:15:00'),
        image: "/images/accident.jpg",
        likes: 8,
        comments: 5
      },
      {
        id: 3,
        title: "กิจกรรมชมรมดนตรี",
        content: "ชมรมดนตรีมีกิจกรรมซ้อมดนตรีที่หอประชุมใหญ่ เวลา 16:00 น. รับสมัครสมาชิกใหม่",
        type: "general",
        location: { lat: 18.8982, lng: 99.0141 },
        author: "ชมรมดนตรี",
        timestamp: new Date('2024-01-14T14:20:00'),
        image: "/images/music-club.jpg",
        likes: 22,
        comments: 7
      },
      {
        id: 4,
        title: "ตึกคณะวิศวกรรมศาสตร์ปิดปรับปรุง",
        content: "ตึกคณะวิศวกรรมศาสตร์ปิดทำการในวันเสาร์-อาทิตย์นี้สำหรับการปรับปรุงระบบไฟฟ้า",
        type: "buildings",
        location: { lat: 18.8958, lng: 99.0152 },
        author: "คณะวิศวกรรมศาสตร์",
        timestamp: new Date('2024-01-13T16:45:00'),
        likes: 12,
        comments: 2
      }
    ];
    setPosts(mockPosts);
  };

  const filteredPosts = posts.filter(post => filters[post.type]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log('Post clicked:', post);
  };

  // ถ้ายังไม่เป็น client-side ให้แสดง loading
  if (!isClient) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.mapWrapper}>
          <MapComponent
            posts={filteredPosts}
            userLocation={userLocation}
            onPostClick={handlePostClick}
          />
        </div>

        <FilterPanel
          filters={filters}
          setFilters={setFilters}
        />

        {/* Selected Post Info */}
        {selectedPost && (
          <div className={styles.selectedPost}>
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.content}</p>
            <button onClick={() => setSelectedPost(null)}>ปิด</button>
          </div>
        )}
      </div>
    </Layout>
  );
}