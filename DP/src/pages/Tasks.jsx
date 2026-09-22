import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { sortTasks, filterTasks, searchTasks } from '../utils/taskUtils';
import { formatDate } from '../utils/dateUtils';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import styles from './Tasks.module.css';

export default function Tasks({ onAddTask, onEditTask }) {
  const { tasks, searchQuery } = useApp();
  const [filter, setFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const visibleTasks = useMemo(() => {
    let result = tasks;
    result = filterTasks(result, filter, categoryFilter);
    result = searchTasks(result, searchQuery);
    return sortTasks(result);
  }, [tasks, filter, categoryFilter, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map();
    visibleTasks.forEach((task) => {
      const key = task.date || 'No date';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(task);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [visibleTasks]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>All Tasks</h2>
          <p className={styles.sub}>{tasks.length} total tasks across all dates</p>
        </div>
        <button className={styles.addBtn} onClick={onAddTask}>+ Add Task</button>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {visibleTasks.length === 0 ? (
        <EmptyState onAdd={onAddTask} />
      ) : (
        <div className={styles.list}>
          {grouped.map(([date, items]) => (
            <div key={date}>
              <div className={styles.datePill}>{formatDate(date) || date}</div>
              {items.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
