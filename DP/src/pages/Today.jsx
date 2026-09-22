import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { sortTasks, filterTasks, searchTasks, getStatsForDate } from '../utils/taskUtils';
import StatSummaryCards from '../components/StatSummaryCards';
import ProgressCard from '../components/ProgressCard';
import QuickAdd from '../components/QuickAdd';
import DateSelector from '../components/DateSelector';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { formatTime } from '../utils/dateUtils';
import styles from './Today.module.css';

export default function Today({ onAddTask, onEditTask }) {
  const { tasks, selectedDate, searchQuery } = useApp();
  const [filter, setFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const dayTasks = useMemo(
    () => tasks.filter((t) => t.date === selectedDate),
    [tasks, selectedDate]
  );

  const stats = useMemo(() => getStatsForDate(tasks, selectedDate), [tasks, selectedDate]);

  const visibleTasks = useMemo(() => {
    let result = dayTasks;
    result = filterTasks(result, filter, categoryFilter);
    result = searchTasks(result, searchQuery);
    return sortTasks(result);
  }, [dayTasks, filter, categoryFilter, searchQuery]);

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <StatSummaryCards
          total={stats.total}
          completed={stats.completed}
          remaining={stats.remaining}
        />
        <ProgressCard total={stats.total} completed={stats.completed} />
      </div>

      <QuickAdd selectedDate={selectedDate} />

      <div className={styles.plannerHeader}>
        <DateSelector />
        <div className={styles.headerRight}>
          <button
            className={`${styles.filterToggle} ${showFilters ? styles.filterActive : ''}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            🔽 Filters {filter !== 'All' || categoryFilter !== 'All' ? '(active)' : ''}
          </button>
        </div>
      </div>

      {showFilters && (
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      )}

      {visibleTasks.length === 0 ? (
        <EmptyState onAdd={onAddTask} />
      ) : (
        <div className={styles.timeline}>
          {visibleTasks.map((task, i) => {
            const showTime = task.time && (i === 0 || visibleTasks[i - 1]?.time !== task.time);
            return (
              <div key={task.id} className={styles.timelineItem}>
                {showTime && (
                  <div className={styles.timeLabel}>
                    🕐 {formatTime(task.time)}
                  </div>
                )}
                <TaskCard task={task} onEdit={onEditTask} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
