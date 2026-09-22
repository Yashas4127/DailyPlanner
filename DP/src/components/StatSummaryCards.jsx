import styles from './StatSummaryCards.module.css';
import { RiTaskLine, RiCheckboxCircleLine, RiTimeLine, RiPieChartLine } from 'react-icons/ri';

const cards = [
  { key: 'total', label: "Today's Tasks", icon: RiTaskLine, color: '#6366f1', bg: '#6366f112' },
  { key: 'completed', label: 'Completed', icon: RiCheckboxCircleLine, color: '#10b981', bg: '#10b98112' },
  { key: 'remaining', label: 'Remaining', icon: RiTimeLine, color: '#f59e0b', bg: '#f59e0b12' },
  { key: 'pct', label: 'Progress', icon: RiPieChartLine, color: '#8b5cf6', bg: '#8b5cf612' },
];

export default function StatSummaryCards({ total, completed, remaining }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const values = { total, completed, remaining, pct: `${pct}%` };

  return (
    <div className={styles.grid}>
      {cards.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className={styles.card} style={{ '--accent': color, '--accent-bg': bg }}>
          <div className={styles.iconWrap}>
            <Icon />
          </div>
          <div className={styles.info}>
            <span className={styles.value}>{values[key]}</span>
            <span className={styles.label}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
