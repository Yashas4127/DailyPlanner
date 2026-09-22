const TASKS_KEY = 'dailyflow_tasks';
const THEME_KEY = 'dailyflow_theme';
const SETTINGS_KEY = 'dailyflow_settings';

export const getTasks = () => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

const DEFAULT_SETTINGS = {
  defaultPriority: 'Medium',
  defaultCategory: 'General',
  userName: 'Yashas',
};

export const getSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const clearAllTasks = () => {
  localStorage.removeItem(TASKS_KEY);
};

export const exportTasks = (tasks) => {
  const data = Array.isArray(tasks) ? tasks : getTasks();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dailyflow-tasks-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseImportedTasks = (raw) => {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!Array.isArray(data)) throw new Error('Invalid task file');
  return data.filter((t) => t && typeof t.title === 'string' && t.title.trim());
};
