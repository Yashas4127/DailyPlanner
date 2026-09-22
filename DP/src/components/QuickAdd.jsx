import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiAddLine } from 'react-icons/ri';
import styles from './QuickAdd.module.css';

export default function QuickAdd({ selectedDate }) {
  const { addTask, settings } = useApp();
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    addTask({
      title: value.trim(),
      date: selectedDate,
      priority: settings.defaultPriority || 'Medium',
      category: settings.defaultCategory || 'General',
    });
    setValue('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <span className={styles.pencil}>✏️</span>
      <input
        className={styles.input}
        placeholder="What do you want to accomplish today?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={120}
      />
      <button
        type="submit"
        className={styles.btn}
        disabled={!value.trim()}
        aria-label="Quick add task"
      >
        <RiAddLine /> Add
      </button>
    </form>
  );
}
