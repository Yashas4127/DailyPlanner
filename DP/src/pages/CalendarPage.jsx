import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday as checkToday } from 'date-fns';
import { getStatsForDate } from '../utils/taskUtils';
import styles from './CalendarPage.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage({ onAddTask, onEditTask }) {
  const { tasks, selectedDate, setSelectedDate } = useApp();
  const [viewDate, setViewDate] = useState(new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // 0=Sun

  const prevMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  };
  const nextMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  };

  const selectedStats = useMemo(
    () => getStatsForDate(tasks, selectedDate),
    [tasks, selectedDate]
  );

  const dayTasks = useMemo(
    () => tasks.filter((t) => t.date === selectedDate),
    [tasks, selectedDate]
  );

  return (
    <div className={styles.page}>
      <div className={styles.calWrap}>
        <div className={styles.calHeader}>
          <button onClick={prevMonth} className={styles.navBtn}>‹</button>
          <h2>{format(viewDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className={styles.navBtn}>›</button>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
        </div>

        <div className={styles.grid}>
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className={styles.dayEmpty} />
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const stats = getStatsForDate(tasks, dateStr);
            const isSelected = dateStr === selectedDate;
            const isT = checkToday(day);

            return (
              <button
                key={dateStr}
                className={`${styles.dayBtn}
                  ${isSelected ? styles.selected : ''}
                  ${isT ? styles.today : ''}
                  ${!isSameMonth(day, viewDate) ? styles.faded : ''}
                `}
                onClick={() => setSelectedDate(dateStr)}
              >
                <span className={styles.dayNum}>{format(day, 'd')}</span>
                {stats.total > 0 && (
                  <div className={styles.dots}>
                    {stats.completed > 0 && <span className={styles.dotGreen} />}
                    {stats.remaining > 0 && <span className={styles.dotPurple} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <h3>{format(parseISO(selectedDate), 'EEEE, MMMM d')}</h3>
          <div className={styles.sideStats}>
            <span className={styles.sideStatBadge} style={{ background: '#6366f115', color: '#6366f1' }}>
              {selectedStats.total} tasks
            </span>
            <span className={styles.sideStatBadge} style={{ background: '#10b98115', color: '#10b981' }}>
              {selectedStats.completed} done
            </span>
          </div>
        </div>

        {dayTasks.length === 0 ? (
          <div className={styles.noTasks}>
            <span>📭</span>
            <p>No tasks on this day.</p>
            <button className={styles.addBtn} onClick={onAddTask}>+ Add Task</button>
          </div>
        ) : (
          <div className={styles.taskList}>
            {dayTasks.map((t) => (
              <div
                key={t.id}
                className={`${styles.taskRow} ${t.completed ? styles.taskDone : ''}`}
                onClick={() => onEditTask?.(t)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onEditTask?.(t); }}
              >
                <span className={styles.taskDot} style={{ background: t.completed ? '#10b981' : '#6366f1' }} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskTitle}>{t.title}</span>
                  {t.time && <span className={styles.taskTime}>{t.time}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
