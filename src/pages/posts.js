import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import styles from '../styles/Posts.module.css';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบการล็อกอิน
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
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
      },
      {
        id: 3,
        title: "กิจกรรมชมรมดนตรีวันนี้",
        content: "ชมรมดนตรีมีกิจกรรมซ้อมดนตรีที่หอประชุมใหญ่ เวลา 16:00 น. รับสมัครสมาชิกใหม่",
        type: "general",
        location: { lat: 18.8982, lng: 99.0141 },
        author: "ชมรมดนตรี",
        timestamp: new Date(),
        image: "/images/music-club.jpg",
        likes: 22,
        comments: 7
      }
    ];
    setPosts(mockPosts);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>โพสต์ทั้งหมด</h1>
        
        <div className={styles.postsGrid}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className={styles.emptyState}>
            <p>ยังไม่มีโพสต์ในขณะนี้</p>
            <button 
              onClick={() => router.push('/create-post')}
              className={styles.createPostButton}
            >
              สร้างโพสต์แรกของคุณ
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}