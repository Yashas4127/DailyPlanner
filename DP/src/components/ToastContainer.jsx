import { useApp } from '../context/AppContext';
import { RiCheckLine, RiCloseLine, RiInformationLine } from 'react-icons/ri';
import styles from './ToastContainer.module.css';

const ICONS = {
  success: RiCheckLine,
  error: RiCloseLine,
  info: RiInformationLine,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || RiCheckLine;
        return (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <div className={styles.iconWrap}>
              <Icon />
            </div>
            <span className={styles.message}>{toast.message}</span>
            <button className={styles.closeBtn} onClick={() => removeToast(toast.id)}>
              <RiCloseLine />
            </button>
          </div>
        );
      })}
    </div>
  );
}
