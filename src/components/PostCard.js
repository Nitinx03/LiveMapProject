import styles from '../styles/PostCard.module.css';

export default function PostCard({ post, isSingle = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const types = {
      general: 'เรื่องทั่วไป',
      buildings: 'ตึกในมหาลัย',
      restaurants: 'ร้านอาหาร',
      accidents: 'อุบัติเหตุ'
    };
    return types[type] || 'ทั่วไป';
  };

  const getTypeIcon = (type) => {
    const icons = {
      general: '🔵',
      buildings: '🏢',
      restaurants: '🍴',
      accidents: '⚠️'
    };
    return icons[type] || '📍';
  };

  return (
    <div className={`${styles.card} ${isSingle ? styles.singleCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.type}>
          <span className={styles.typeIcon}>{getTypeIcon(post.type)}</span>
          <span className={styles.typeLabel}>{getTypeLabel(post.type)}</span>
        </div>
        <div className={styles.date}>
          {formatDate(post.timestamp)}
        </div>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.content}>{post.content}</p>

      {post.image && (
        <div className={styles.image}>
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.author}>
          โพสต์โดย: {post.author}
        </div>
        <div className={styles.stats}>
          <span>❤️ {post.likes || 0}</span>
          <span>💬 {post.comments || 0}</span>
        </div>
      </div>

      {isSingle && post.location && (
        <div className={styles.locationInfo}>
          <strong>ตำแหน่ง:</strong> ละติจูด: {post.location.lat.toFixed(6)}, ลองจิจูด: {post.location.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}