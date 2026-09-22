import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getWeekStats, getStreak, CATEGORIES } from '../utils/taskUtils';
import { getWeekDays } from '../utils/dateUtils';
import styles from './Statistics.module.css';

export default function Statistics() {
  const { tasks } = useApp();

  const weekDays = useMemo(() => getWeekDays(), []);
  const weekStats = useMemo(() => getWeekStats(tasks, weekDays), [tasks, weekDays]);
  const streak = useMemo(() => getStreak(tasks), [tasks]);

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

  const weekTotal = weekStats.reduce((s, d) => s + d.total, 0);
  const weekCompleted = weekStats.reduce((s, d) => s + d.completed, 0);
  const weekMax = Math.max(...weekStats.map((d) => d.total), 1);

  const categoryStats = CATEGORIES.map((cat) => ({
    ...cat,
    count: tasks.filter((t) => t.category === cat.id).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  const priorityStats = [
    { label: 'High', color: '#ef4444', count: tasks.filter((t) => t.priority === 'High').length },
    { label: 'Medium', color: '#f59e0b', count: tasks.filter((t) => t.priority === 'Medium').length },
    { label: 'Low', color: '#10b981', count: tasks.filter((t) => t.priority === 'Low').length },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>Statistics</h2>
        <p>Your productivity insights</p>
      </div>

      <div className={styles.topCards}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#6366f115', color: '#6366f1' }}>📊</div>
          <div>
            <div className={styles.statNum}>{totalTasks}</div>
            <div className={styles.statLabel}>Total Tasks</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#10b98115', color: '#10b981' }}>✅</div>
          <div>
            <div className={styles.statNum}>{totalCompleted}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>🎯</div>
          <div>
            <div className={styles.statNum}>{completionRate}%</div>
            <div className={styles.statLabel}>Completion Rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ef444415', color: '#ef4444' }}>🔥</div>
          <div>
            <div className={styles.statNum}>{streak}</div>
            <div className={styles.statLabel}>Day Streak</div>
          </div>
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📅 Weekly Productivity</h3>
          <div className={styles.barChart}>
            {weekStats.map((d) => {
              const pct = weekMax === 0 ? 0 : (d.total / weekMax) * 100;
              const donePct = d.total === 0 ? 0 : (d.completed / d.total) * 100;
              return (
                <div key={d.date} className={styles.chartBar}>
                  <div className={styles.barWrap}>
                    <div className={styles.barBg} title={`${d.completed}/${d.total} tasks`}>
                      <div className={styles.barFill} style={{ height: `${pct}%` }}>
                        <div className={styles.barDone} style={{ height: `${donePct}%` }} />
                      </div>
                    </div>
                  </div>
                  <span className={styles.barDay}>{d.day}</span>
                  <span className={styles.barCount}>{d.total}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.legend}>
            <span><span className={styles.dot} style={{ background: '#6366f1' }} />Total</span>
            <span><span className={styles.dot} style={{ background: '#10b981' }} />Completed</span>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📌 By Category</h3>
          {categoryStats.length === 0 ? (
            <p className={styles.empty}>No tasks yet</p>
          ) : (
            <div className={styles.catList}>
              {categoryStats.map((cat) => {
                const pct = totalTasks === 0 ? 0 : Math.round((cat.count / totalTasks) * 100);
                return (
                  <div key={cat.id} className={styles.catRow}>
                    <div className={styles.catInfo}>
                      <span>{cat.emoji}</span>
                      <span className={styles.catName}>{cat.label}</span>
                      <span className={styles.catCount}>{cat.count}</span>
                    </div>
                    <div className={styles.miniBar}>
                      <div className={styles.miniFill} style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🏳️ Priority Breakdown</h3>
          <div className={styles.priList}>
            {priorityStats.map((p) => {
              const pct = totalTasks === 0 ? 0 : Math.round((p.count / totalTasks) * 100);
              return (
                <div key={p.label} className={styles.priRow}>
                  <div className={styles.priInfo}>
                    <span className={styles.priDot} style={{ background: p.color }} />
                    <span>{p.label}</span>
                    <span className={styles.priCount}>{p.count} tasks</span>
                  </div>
                  <div className={styles.miniBar}>
                    <div className={styles.miniFill} style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📈 This Week</h3>
          <div className={styles.weekSummary}>
            <div className={styles.weekStat}>
              <span className={styles.weekNum}>{weekCompleted}</span>
              <span className={styles.weekLabel}>Tasks Completed</span>
            </div>
            <div className={styles.weekStat}>
              <span className={styles.weekNum}>{weekTotal}</span>
              <span className={styles.weekLabel}>Total Planned</span>
            </div>
            <div className={styles.weekStat}>
              <span className={styles.weekNum}>
                {weekTotal === 0 ? 0 : Math.round((weekCompleted / weekTotal) * 100)}%
              </span>
              <span className={styles.weekLabel}>Weekly Rate</span>
            </div>
            <div className={styles.weekStat}>
              <span className={styles.weekNum} style={{ color: '#ef4444' }}>{streak} 🔥</span>
              <span className={styles.weekLabel}>Current Streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
