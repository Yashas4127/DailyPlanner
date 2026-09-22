import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PRIORITIES } from '../utils/taskUtils';
import { todayStr } from '../utils/dateUtils';
import { RiCloseLine } from 'react-icons/ri';
import styles from './AddTaskModal.module.css';

export default function AddTaskModal({ onClose, editTask }) {
  const { addTask, updateTask, settings, selectedDate } = useApp();
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: selectedDate || todayStr(),
    time: '',
    category: settings.defaultCategory || 'General',
    priority: settings.defaultPriority || 'Medium',
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        date: editTask.date || todayStr(),
        time: editTask.time || '',
        category: editTask.category || 'General',
        priority: editTask.priority || 'Medium',
      });
    } else {
      setForm({
        title: '',
        description: '',
        date: selectedDate || todayStr(),
        time: '',
        category: settings.defaultCategory || 'General',
        priority: settings.defaultPriority || 'Medium',
      });
    }
    firstInputRef.current?.focus();
  }, [editTask, selectedDate, settings]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editTask) {
      updateTask(editTask.id, form);
    } else {
      addTask(form);
    }
    onClose();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={editTask ? 'Edit Task' : 'Add Task'}>
        <div className={styles.modalHeader}>
          <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <RiCloseLine />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Task Title *</label>
            <input
              ref={firstInputRef}
              type="text"
              placeholder="e.g. Complete Binary Tree problems"
              value={form.title}
              onChange={set('title')}
              required
              maxLength={120}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Date</label>
              <input type="date" value={form.date} onChange={set('date')} />
            </div>
            <div className={styles.field}>
              <label>Time</label>
              <input type="time" value={form.time} onChange={set('time')} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.catChip} ${form.category === cat.id ? styles.catSelected : ''}`}
                  style={form.category === cat.id ? { background: cat.color + '20', borderColor: cat.color, color: cat.color } : {}}
                  onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>Priority</label>
            <div className={styles.priorityRow}>
              {PRIORITIES.map((pri) => (
                <button
                  key={pri.id}
                  type="button"
                  className={`${styles.priChip} ${form.priority === pri.id ? styles.priSelected : ''}`}
                  style={form.priority === pri.id ? { background: pri.bg, borderColor: pri.color, color: pri.color } : {}}
                  onClick={() => setForm((f) => ({ ...f, priority: pri.id }))}
                >
                  {pri.dot} {pri.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>Description <span className={styles.optional}>(optional)</span></label>
            <textarea
              placeholder="Add details about your task..."
              value={form.description}
              onChange={set('description')}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={!form.title.trim()}>
              {editTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
