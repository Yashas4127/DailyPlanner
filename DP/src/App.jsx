import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import AddTaskModal from './components/AddTaskModal';
import Today from './pages/Today';
import CalendarPage from './pages/CalendarPage';
import Tasks from './pages/Tasks';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import { useApp } from './context/AppContext';
import styles from './App.module.css';

function AppInner() {
  const { currentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const openAddModal = () => { setEditTask(null); setModalOpen(true); };
  const openEditModal = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const renderPage = () => {
    switch (currentPage) {
      case 'today': return <Today onAddTask={openAddModal} onEditTask={openEditModal} />;
      case 'calendar': return <CalendarPage onAddTask={openAddModal} onEditTask={openEditModal} />;
      case 'tasks': return <Tasks onAddTask={openAddModal} onEditTask={openEditModal} />;
      case 'statistics': return <Statistics />;
      case 'settings': return <Settings />;
      default: return <Today onAddTask={openAddModal} onEditTask={openEditModal} />;
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <Header
          onAddTask={openAddModal}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className={styles.content}>
          {renderPage()}
        </main>
      </div>

      {modalOpen && (
        <AddTaskModal onClose={closeModal} editTask={editTask} />
      )}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
