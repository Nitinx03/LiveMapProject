import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Map.module.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// สร้าง custom icons สำหรับแต่ละประเภทโพสต์
const createCustomIcon = (type) => {
  const colors = {
    general: '#4285F4',
    buildings: '#34A853', 
    restaurants: '#FBBC05',
    accidents: '#EA4335'
  };

  const icons = {
    general: '🔵',
    buildings: '🏢',
    restaurants: '🍴',
    accidents: '⚠️'
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colors[type] || '#4285F4'};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      ">
        ${icons[type] || '📍'}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Icon สำหรับตำแหน่งผู้ใช้
const userIcon = L.divIcon({
  html: `
    <div style="
      background-color: #FF6B6B;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      animation: pulse 1.5s infinite;
    ">
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `,
  className: 'user-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function LocationMarker({ onLocationFound }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationFound(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>ตำแหน่งที่คุณเลือก</Popup>
    </Marker>
  );
}

export default function MapComponent({ posts, userLocation, onPostClick }) {
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // ตำแหน่งมหาวิทยาลัยแม่โจ้
  const maejoLocation = [18.8974, 99.0130];

  useEffect(() => {
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 16);
    }
  }, [map, userLocation]);

  const handleLocationFound = (location) => {
    setCurrentLocation(location);
    console.log('Location selected:', location);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={maejoLocation}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ตำแหน่งผู้ใช้ปัจจุบัน */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>ตำแหน่งของคุณ</strong>
                <p>คุณอยู่ที่จุดนี้</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker สำหรับแต่ละโพสต์ */}
        {posts.map((post) => (
          <Marker
            key={post.id}
            position={[post.location.lat, post.location.lng]}
            icon={createCustomIcon(post.type)}
            eventHandlers={{
              click: () => onPostClick && onPostClick(post),
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <div className={styles.popupHeader}>
                  <span className={styles.postType}>{getTypeLabel(post.type)}</span>
                  <span className={styles.postDate}>{formatDate(post.timestamp)}</span>
                </div>
                <h3 className={styles.popupTitle}>{post.title}</h3>
                <p className={styles.popupText}>{post.content}</p>
                {post.image && (
                  <div className={styles.popupImage}>
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                <div className={styles.popupFooter}>
                  <span>โดย: {post.author}</span>
                  <div className={styles.popupStats}>
                    <span>❤️ {post.likes || 0}</span>
                    <span>💬 {post.comments || 0}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* อนุญาตให้ผู้ใช้คลิกเลือกตำแหน่งได้ */}
        <LocationMarker onLocationFound={handleLocationFound} />
      </MapContainer>

      {/* Legend */}
      <div className={styles.legend}>
        <h4>คำอธิบายสัญลักษณ์</h4>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{backgroundColor: '#FF6B6B'}}></div>
          <span>ตำแหน่งของคุณ</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{backgroundColor: '#4285F4'}}>🔵</div>
          <span>เรื่องทั่วไป</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{backgroundColor: '#34A853'}}>🏢</div>
          <span>ตึกในมหาลัย</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{backgroundColor: '#FBBC05'}}>🍴</div>
          <span>ร้านอาหาร</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{backgroundColor: '#EA4335'}}>⚠️</div>
          <span>อุบัติเหตุ</span>
        </div>
      </div>
    </div>
  );
}