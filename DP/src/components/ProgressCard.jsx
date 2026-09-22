import styles from './ProgressCard.module.css';

export default function ProgressCard({ total, completed }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>Today's Progress</span>
        <span className={styles.pct}>{pct}%</span>
      </div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.sub}>
        {completed} of {total} task{total !== 1 ? 's' : ''} completed
      </p>
    </div>
  );
}
