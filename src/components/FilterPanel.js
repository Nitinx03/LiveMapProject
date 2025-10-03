import { useState } from 'react';
import styles from '../styles/FilterPanel.module.css';

export default function FilterPanel({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  return (
    <>
      {/* ปุ่มเปิด/ปิด Filter Panel */}
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Filter Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <h3>กรองโพสต์</h3>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterItem}>
            <input
              type="checkbox"
              checked={filters.general}
              onChange={() => handleFilterChange('general')}
            />
            <span>เรื่องทั่วไป</span>
          </label>

          <label className={styles.filterItem}>
            <input
              type="checkbox"
              checked={filters.buildings}
              onChange={() => handleFilterChange('buildings')}
            />
            <span>ตึกในมหาลัย</span>
          </label>

          <label className={styles.filterItem}>
            <input
              type="checkbox"
              checked={filters.restaurants}
              onChange={() => handleFilterChange('restaurants')}
            />
            <span>ร้านอาหาร</span>
          </label>

          <label className={styles.filterItem}>
            <input
              type="checkbox"
              checked={filters.accidents}
              onChange={() => handleFilterChange('accidents')}
            />
            <span>อุบัติเหตุ</span>
          </label>
        </div>
      </div>
    </>
  );
}