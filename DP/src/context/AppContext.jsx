import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getTasks, saveTasks, getTheme, saveTheme, getSettings, saveSettings, clearAllTasks } from '../utils/localStorage';
import { createTask } from '../utils/taskUtils';
import { todayStr } from '../utils/dateUtils';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => getTasks());
  const [theme, setTheme] = useState(() => getTheme());
  const [settings, setSettings] = useState(() => getSettings());
  const [currentPage, setCurrentPage] = useState('today');
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const tasksRef = useRef(tasks);
  const themeRef = useRef(theme);
  const settingsRef = useRef(settings);

  useEffect(() => {
    tasksRef.current = tasks;
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    themeRef.current = theme;
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    settingsRef.current = settings;
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const persistBeforePageExit = () => {
      saveTasks(tasksRef.current);
      saveTheme(themeRef.current);
      saveSettings(settingsRef.current);
    };

    window.addEventListener('pagehide', persistBeforePageExit);
    return () => window.removeEventListener('pagehide', persistBeforePageExit);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTask = useCallback((taskData) => {
    const task = createTask({
      category: settings.defaultCategory || 'General',
      priority: settings.defaultPriority || 'Medium',
      ...taskData,
    });
    setTasks((prev) => [...prev, task]);
    addToast(`"${task.title}" added!`, 'success');
    return task;
  }, [settings, addToast]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast('Task updated.', 'info');
  }, [addToast]);

  const importTasks = useCallback((incoming) => {
    setTasks((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const merged = [...prev];
      incoming.forEach((task) => {
        const next = createTask(task);
        if (existingIds.has(next.id)) next.id = createTask().id;
        merged.push(next);
      });
      return merged;
    });
    addToast(`Imported ${incoming.length} task${incoming.length === 1 ? '' : 's'}.`, 'success');
  }, [addToast]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) addToast(`"${task.title}" deleted.`, 'error');
      return prev.filter((t) => t.id !== id);
    });
  }, [addToast]);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, completed: !t.completed };
          addToast(updated.completed ? `✓ "${t.title}" completed!` : `"${t.title}" marked pending.`, 'success');
          return updated;
        }
        return t;
      })
    );
  }, [addToast]);

  const clearAll = useCallback(() => {
    setTasks([]);
    clearAllTasks();
    addToast('All tasks cleared.', 'error');
  }, [addToast]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({
    tasks,
    theme,
    settings,
    currentPage,
    selectedDate,
    searchQuery,
    toasts,
    setCurrentPage,
    setSelectedDate,
    setSearchQuery,
    addTask,
    updateTask,
    importTasks,
    deleteTask,
    toggleComplete,
    clearAll,
    toggleTheme,
    setSettings,
    removeToast,
    addToast,
  }), [tasks, theme, settings, currentPage, selectedDate, searchQuery, toasts, addTask, updateTask, importTasks, deleteTask, toggleComplete, clearAll, toggleTheme, removeToast, addToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
