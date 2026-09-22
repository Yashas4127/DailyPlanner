import styles from './EmptyState.module.css';

export default function EmptyState({ onAdd }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>✨</div>
      <h3 className={styles.title}>Your day is clear!</h3>
      <p className={styles.sub}>You don't have any tasks planned yet. Start adding some!</p>
      <button className={styles.btn} onClick={onAdd}>
        + Add Your First Task
      </button>
    </div>
  );
}
