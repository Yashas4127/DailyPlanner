import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiSearchLine, RiBellLine, RiAddLine, RiMenuLine } from 'react-icons/ri';
import { getGreeting, todayStr } from '../utils/dateUtils';
import styles from './Header.module.css';

export default function Header({ onAddTask, onToggleSidebar }) {
  const { searchQuery, setSearchQuery, tasks, settings, setCurrentPage } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  const pendingToday = useMemo(
    () => tasks.filter((t) => t.date === todayStr() && !t.completed),
    [tasks]
  );

  useEffect(() => {
    if (!showNotifs) return;
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showNotifs]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <RiMenuLine />
        </button>
        <div className={styles.greeting}>
          <h1 className={styles.greetingText}>
            {getGreeting()}, {settings.userName || 'there'} 👋
          </h1>
          <p className={styles.subtitle}>Let's make today productive.</p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={`${styles.searchWrap} ${showSearch ? styles.searchOpen : ''}`}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search"
          >
            <RiSearchLine />
          </button>
          {showSearch && (
            <input
              autoFocus
              className={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setShowSearch(false); }}
            />
          )}
        </div>

        <div className={styles.notifWrap} ref={notifRef}>
          <button
            className={styles.iconBtn}
            aria-label="Notifications"
            onClick={() => setShowNotifs((v) => !v)}
          >
            <RiBellLine />
            {pendingToday.length > 0 && (
              <span className={styles.badge}>{pendingToday.length > 9 ? '9+' : pendingToday.length}</span>
            )}
          </button>
          {showNotifs && (
            <div className={styles.notifPanel}>
              <div className={styles.notifTitle}>Today's remaining</div>
              {pendingToday.length === 0 ? (
                <p className={styles.notifEmpty}>You're all caught up.</p>
              ) : (
                pendingToday.slice(0, 6).map((t) => (
                  <button
                    key={t.id}
                    className={styles.notifItem}
                    onClick={() => {
                      setCurrentPage('today');
                      setShowNotifs(false);
                    }}
                  >
                    {t.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button className={styles.addBtn} onClick={onAddTask}>
          <RiAddLine />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
