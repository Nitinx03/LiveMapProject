import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/CreatePost.module.css';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          alert('ไม่สามารถดึงตำแหน่งปัจจุบันได้ กรุณาตรวจสอบการอนุญาตตำแหน่ง');
        }
      );
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userLocation) {
      alert('ไม่สามารถดึงตำแหน่งปัจจุบันได้ กรุณาตรวจสอบการอนุญาตตำแหน่ง');
      return;
    }

    setIsSubmitting(true);

    try {
      // อ่านข้อมูลผู้ใช้
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // สร้างโพสต์ใหม่
      const newPost = {
        id: Date.now(), // ใช้ timestamp เป็น ID
        title,
        content,
        type: postType,
        location: userLocation,
        author: userData.name || userData.username || 'ผู้ใช้',
        timestamp: new Date(),
        image: imagePreview,
        likes: 0,
        comments: 0
      };

      // อ่านโพสต์ที่มีอยู่จาก localStorage
      const existingPosts = localStorage.getItem('maejo-posts');
      let posts = [];
      
      if (existingPosts) {
        posts = JSON.parse(existingPosts);
      }
      
      // เพิ่มโพสต์ใหม่
      posts.unshift(newPost); // เพิ่มที่ต้น array เพื่อแสดงโพสต์ล่าสุดก่อน
      
      // บันทึกลง localStorage
      localStorage.setItem('maejo-posts', JSON.stringify(posts));

      // รอสักครู่เพื่อให้เห็น loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      // หลังจากสร้างโพสต์สำเร็จ กลับไปยังหน้าแผนที่
      router.push('/map');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('เกิดข้อผิดพลาดในการสร้างโพสต์');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>สร้างโพสต์ใหม่</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">หัวข้อโพสต์</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เพิ่มหัวข้อโพสต์"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="content">เนื้อหา</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="เขียนเนื้อหาโพสต์ของคุณ..."
              rows="5"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="type">ประเภทโพสต์</label>
            <select
              id="type"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              <option value="general">เรื่องทั่วไป</option>
              <option value="buildings">ตึกในมหาลัย</option>
              <option value="restaurants">ร้านอาหาร</option>
              <option value="accidents">อุบัติเหตุ</option>
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="image">รูปภาพ (ไม่บังคับ)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className={styles.locationInfo}>
            <p>
              <strong>ตำแหน่งที่โพสต์:</strong> {userLocation 
                ? `ละติจูด: ${userLocation.lat.toFixed(6)}, ลองจิจูด: ${userLocation.lng.toFixed(6)}` 
                : 'กำลังดึงตำแหน่ง...'}
            </p>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting || !userLocation}
          >
            {isSubmitting ? 'กำลังโพสต์...' : 'โพสต์'}
          </button>
        </form>
      </div>
    </Layout>
  );
}