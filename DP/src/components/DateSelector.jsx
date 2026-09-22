import { useApp } from '../context/AppContext';
import { RiArrowLeftLine, RiArrowRightLine, RiCalendarLine } from 'react-icons/ri';
import { getPrevDay, getNextDay, todayStr, formatFullDate } from '../utils/dateUtils';
import styles from './DateSelector.module.css';

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useApp();
  const isToday = selectedDate === todayStr();

  return (
    <div className={styles.wrap}>
      <button
        className={styles.navBtn}
        onClick={() => setSelectedDate(getPrevDay(selectedDate))}
        aria-label="Previous day"
      >
        <RiArrowLeftLine />
      </button>

      <div className={styles.dateDisplay}>
        <RiCalendarLine className={styles.calIcon} />
        <div>
          <span className={styles.dayLabel}>{formatFullDate(selectedDate)}</span>
        </div>
      </div>

      <button
        className={styles.navBtn}
        onClick={() => setSelectedDate(getNextDay(selectedDate))}
        aria-label="Next day"
      >
        <RiArrowRightLine />
      </button>

      {!isToday && (
        <button
          className={styles.todayBtn}
          onClick={() => setSelectedDate(todayStr())}
        >
          Today
        </button>
      )}
    </div>
  );
}
