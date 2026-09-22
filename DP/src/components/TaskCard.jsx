import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  RiCheckLine, RiEditLine, RiDeleteBinLine, RiMoreLine,
  RiTimeLine, RiFlag2Line, RiCheckboxCircleLine, RiPushpin2Line
} from 'react-icons/ri';
import { getCategoryInfo, getPriorityInfo } from '../utils/taskUtils';
import { formatTime } from '../utils/dateUtils';
import styles from './TaskCard.module.css';

export default function TaskCard({ task, onEdit }) {
  const { toggleComplete, deleteTask, updateTask } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const menuRef = useRef(null);

  const cat = getCategoryInfo(task.category);
  const pri = getPriorityInfo(task.priority);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setShowPriorityPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handlePriorityChange = (priorityId) => {
    updateTask(task.id, { priority: priorityId });
    setShowPriorityPicker(false);
    setMenuOpen(false);
  };

  return (
    <div className={`${styles.card} ${task.completed ? styles.completed : ''}`}
      style={{ '--cat-color': cat.color }}>
      <button
        className={`${styles.checkBtn} ${task.completed ? styles.checked : ''}`}
        onClick={() => toggleComplete(task.id)}
        aria-label={task.completed ? 'Mark pending' : 'Mark complete'}
      >
        {task.completed && <RiCheckLine />}
      </button>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={`${styles.title} ${task.completed ? styles.titleDone : ''}`}>
            {task.title}
          </span>
          <div className={styles.menuWrap} ref={menuRef}>
            <button
              className={styles.menuBtn}
              onClick={() => { setMenuOpen((v) => !v); setShowPriorityPicker(false); }}
              aria-label="Task options"
            >
              <RiMoreLine />
            </button>
            {menuOpen && (
              <div className={styles.dropdown}>
                <button onClick={() => { toggleComplete(task.id); setMenuOpen(false); }}>
                  <RiCheckboxCircleLine /> {task.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button onClick={() => { onEdit(task); setMenuOpen(false); }}>
                  <RiEditLine /> Edit
                </button>
                <button onClick={() => { setShowPriorityPicker(true); }}>
                  <RiPushpin2Line /> Change Priority
                  {showPriorityPicker && (
                    <div className={styles.priorityPicker}>
                      {['High', 'Medium', 'Low'].map((p) => {
                        const pi = getPriorityInfo(p);
                        return (
                          <button
                            key={p}
                            style={{ color: pi.color }}
                            onClick={(e) => { e.stopPropagation(); handlePriorityChange(p); }}
                          >
                            ● {p}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}
                >
                  <RiDeleteBinLine /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.meta}>
          {task.time && (
            <span className={styles.metaTag}>
              <RiTimeLine /> {formatTime(task.time)}
            </span>
          )}
          <span className={styles.catTag} style={{ background: cat.color + '18', color: cat.color }}>
            {cat.emoji} {cat.label}
          </span>
          <span className={styles.priTag} style={{ background: pri.bg, color: pri.color }}>
            <RiFlag2Line /> {pri.label}
          </span>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>Delete this task?</p>
            <div className={styles.confirmBtns}>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className={styles.confirmDelete} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
