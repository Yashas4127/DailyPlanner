import { CATEGORIES } from '../utils/taskUtils';
import styles from './FilterBar.module.css';

const FILTERS = ['All', 'Pending', 'Completed', 'High', 'Medium', 'Low'];

export default function FilterBar({ filter, setFilter, categoryFilter, setCategoryFilter }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>Filter:</span>
        <div className={styles.chips}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.chip} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Category:</span>
        <div className={styles.chips}>
          <button
            className={`${styles.chip} ${categoryFilter === 'All' ? styles.active : ''}`}
            onClick={() => setCategoryFilter('All')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.chip} ${categoryFilter === cat.id ? styles.active : ''}`}
              style={categoryFilter === cat.id ? { background: cat.color + '20', borderColor: cat.color, color: cat.color } : {}}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
