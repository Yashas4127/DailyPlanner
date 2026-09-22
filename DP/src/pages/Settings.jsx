import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PRIORITIES } from '../utils/taskUtils';
import { exportTasks, parseImportedTasks } from '../utils/localStorage';
import styles from './Settings.module.css';

export default function Settings() {
  const { theme, toggleTheme, settings, setSettings, clearAll, tasks, importTasks, addToast } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>Settings</h2>
        <p>Customize your DailyFlow experience</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>👤 Profile</h3>
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="userName">Display name</label>
            <input
              id="userName"
              className={styles.textInput}
              type="text"
              maxLength={40}
              value={settings.userName || ''}
              onChange={(e) => updateSetting('userName', e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🎨 Appearance</h3>
        <div className={styles.card}>
          <div className={styles.row}>
            <div>
              <div className={styles.rowLabel}>Theme</div>
              <div className={styles.rowSub}>Choose light or dark mode</div>
            </div>
            <div className={styles.themeToggle}>
              <button
                className={`${styles.themeBtn} ${theme === 'light' ? styles.themeActive : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                ☀️ Light
              </button>
              <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeActive : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⚙️ Task Preferences</h3>
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Default Priority</label>
            <div className={styles.chipRow}>
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.chip} ${settings.defaultPriority === p.id ? styles.chipActive : ''}`}
                  style={settings.defaultPriority === p.id ? { background: p.bg, borderColor: p.color, color: p.color } : {}}
                  onClick={() => updateSetting('defaultPriority', p.id)}
                >
                  {p.dot} {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Default Category</label>
            <div className={styles.chipGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.chip} ${settings.defaultCategory === cat.id ? styles.chipActive : ''}`}
                  style={settings.defaultCategory === cat.id
                    ? { background: cat.color + '20', borderColor: cat.color, color: cat.color }
                    : {}}
                  onClick={() => updateSetting('defaultCategory', cat.id)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>💾 Data</h3>
        <div className={styles.card}>
          <div className={styles.dataRow}>
            <div>
              <div className={styles.rowLabel}>Export Tasks</div>
              <div className={styles.rowSub}>Download your tasks as a JSON file</div>
            </div>
            <button className={styles.exportBtn} onClick={() => exportTasks(tasks)}>
              ⬇ Export
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.dataRow}>
            <div>
              <div className={styles.rowLabel}>Import Tasks</div>
              <div className={styles.rowSub}>Merge tasks from a previously exported JSON file</div>
            </div>
            <label className={styles.exportBtn}>
              ⬆ Import
              <input
                type="file"
                accept="application/json,.json"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const parsed = parseImportedTasks(text);
                    importTasks(parsed);
                  } catch {
                    addToast('Could not import that file.', 'error');
                  }
                }}
              />
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.dataRow}>
            <div>
              <div className={styles.rowLabel} style={{ color: '#ef4444' }}>Clear All Tasks</div>
              <div className={styles.rowSub}>Permanently delete all your tasks</div>
            </div>
            <button className={styles.dangerBtn} onClick={() => setShowClearConfirm(true)}>
              🗑 Clear All
            </button>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div className={styles.confirmBackdrop}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmIcon}>⚠️</div>
            <h3>Clear All Tasks?</h3>
            <p>This will permanently delete all your tasks. This action cannot be undone.</p>
            <div className={styles.confirmBtns}>
              <button onClick={() => setShowClearConfirm(false)}>Cancel</button>
              <button
                className={styles.confirmDelete}
                onClick={() => { clearAll(); setShowClearConfirm(false); }}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
