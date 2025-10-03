import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/Account.module.css';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
    bio: '',
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบการล็อกอิน
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // ตั้งค่าข้อมูลเริ่มต้นจากข้อมูลผู้ใช้
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || parsedUser.username + '@maejo.com',
      birthDate: parsedUser.birthDate || '',
      gender: parsedUser.gender || '',
      bio: parsedUser.bio || '',
      profileImage: parsedUser.profileImage || null
    });
    
    if (parsedUser.profileImage) {
      setImagePreview(parsedUser.profileImage);
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, profileImage: file});
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = () => {
    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = {
      ...user,
      ...formData
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('บันทึกข้อมูลสำเร็จ');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>บัญชีของฉัน</h1>
        
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" />
            ) : (
              <div className={styles.placeholderImage}>
                {user.name ? user.name.charAt(0) : user.username.charAt(0)}
              </div>
            )}
            
            {isEditing && (
              <div className={styles.imageUpload}>
                <label htmlFor="profileImage">เปลี่ยนรูปโปรไฟล์</label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
          
          <div className={styles.profileInfo}>
            {isEditing ? (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="email">อีเมล</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="birthDate">วันเกิด</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="gender">เพศ</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="bio">ข้อมูลเกี่ยวกับฉัน</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                
                <div className={styles.buttonGroup}>
                  <button 
                    onClick={handleSave}
                    className={styles.saveButton}
                  >
                    บันทึก
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className={styles.cancelButton}
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{formData.name || 'ยังไม่ได้ตั้งชื่อ'}</h2>
                <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
                <p><strong>อีเมล:</strong> {formData.email}</p>
                <p><strong>วันเกิด:</strong> {formData.birthDate || 'ยังไม่ได้ตั้งค่า'}</p>
                <p><strong>เพศ:</strong> {formData.gender === 'male' ? 'ชาย' : 
                                          formData.gender === 'female' ? 'หญิง' : 
                                          formData.gender === 'other' ? 'อื่นๆ' : 'ยังไม่ได้ตั้งค่า'}</p>
                <p><strong>เกี่ยวกับฉัน:</strong> {formData.bio || 'ยังไม่มีข้อมูล'}</p>
                
                <div className={styles.buttonGroup}>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    แก้ไขโปรไฟล์
                  </button>
                  <button 
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}