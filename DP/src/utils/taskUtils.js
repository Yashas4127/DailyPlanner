import { v4 as uuidv4 } from 'uuid';
import { todayStr, toDateInputValue } from './dateUtils';

export const CATEGORIES = [
  { id: 'Study', label: 'Study', emoji: '📚', color: '#6366f1' },
  { id: 'Work', label: 'Work', emoji: '💼', color: '#0ea5e9' },
  { id: 'Personal', label: 'Personal', emoji: '👤', color: '#ec4899' },
  { id: 'Fitness', label: 'Fitness', emoji: '🏋️', color: '#10b981' },
  { id: 'Project', label: 'Project', emoji: '💻', color: '#f59e0b' },
  { id: 'College', label: 'College', emoji: '🎓', color: '#8b5cf6' },
  { id: 'General', label: 'General', emoji: '📌', color: '#64748b' },
  { id: 'Other', label: 'Other', emoji: '✨', color: '#f97316' },
];

export const PRIORITIES = [
  { id: 'High', label: 'High', color: '#ef4444', bg: '#fef2f2', dot: '🔴' },
  { id: 'Medium', label: 'Medium', color: '#f59e0b', bg: '#fffbeb', dot: '🟡' },
  { id: 'Low', label: 'Low', color: '#10b981', bg: '#f0fdf4', dot: '🟢' },
];

export const createTask = (overrides = {}) => ({
  id: uuidv4(),
  title: '',
  description: '',
  date: todayStr(),
  time: '',
  category: 'General',
  priority: 'Medium',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const getCategoryInfo = (categoryId) =>
  CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES.find((c) => c.id === 'General');

export const getPriorityInfo = (priorityId) =>
  PRIORITIES.find((p) => p.id === priorityId) || PRIORITIES[1];

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Sort by time
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    // Sort by priority
    const pOrder = { High: 0, Medium: 1, Low: 2 };
    return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
  });
};

export const filterTasks = (tasks, filter, category) => {
  let result = tasks;
  if (filter === 'Completed') result = result.filter((t) => t.completed);
  else if (filter === 'Pending') result = result.filter((t) => !t.completed);
  else if (filter === 'High') result = result.filter((t) => t.priority === 'High');
  else if (filter === 'Medium') result = result.filter((t) => t.priority === 'Medium');
  else if (filter === 'Low') result = result.filter((t) => t.priority === 'Low');
  if (category && category !== 'All') result = result.filter((t) => t.category === category);
  return result;
};

export const searchTasks = (tasks, query) => {
  if (!query) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
  );
};

export const getStatsForDate = (tasks, dateStr) => {
  const dayTasks = tasks.filter((t) => t.date === dateStr);
  const completed = dayTasks.filter((t) => t.completed).length;
  return { total: dayTasks.length, completed, remaining: dayTasks.length - completed };
};

export const getWeekStats = (tasks, weekDays) => {
  return weekDays.map((day) => {
    const dayStr = toDateInputValue(day);
    const dayTasks = tasks.filter((t) => t.date === dayStr);
    return {
      date: dayStr,
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      total: dayTasks.length,
      completed: dayTasks.filter((t) => t.completed).length,
    };
  });
};

export const getStreak = (tasks) => {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toDateInputValue(d);
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    if (dayTasks.length > 0 && dayTasks.some((t) => t.completed)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};
