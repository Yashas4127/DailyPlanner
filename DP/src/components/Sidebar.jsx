import { useApp } from '../context/AppContext';
import {
  RiHomeLine, RiCalendarLine, RiTaskLine, RiBarChartLine,
  RiSettingsLine, RiSunLine, RiMoonLine, RiCheckboxCircleLine
} from 'react-icons/ri';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'today', icon: RiHomeLine, label: 'Today' },
  { id: 'calendar', icon: RiCalendarLine, label: 'Calendar' },
  { id: 'tasks', icon: RiTaskLine, label: 'Tasks' },
  { id: 'statistics', icon: RiBarChartLine, label: 'Statistics' },
  { id: 'settings', icon: RiSettingsLine, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { currentPage, setCurrentPage, theme, toggleTheme, settings } = useApp();

  const navigate = (page) => {
    setCurrentPage(page);
    onClose?.();
  };

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <RiCheckboxCircleLine />
          </div>
          <span className={styles.logoText}>DailyFlow</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`${styles.navItem} ${currentPage === id ? styles.active : ''}`}
              onClick={() => navigate(id)}
            >
              <Icon className={styles.navIcon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.bottom}>
          <button className={styles.themeToggle} onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <RiMoonLine /> : <RiSunLine />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <div className={styles.profile}>
            <div className={styles.avatar}>{(settings.userName || 'Y').charAt(0).toUpperCase()}</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{settings.userName || 'You'}</span>
              <span className={styles.profileSub}>Daily planner</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
