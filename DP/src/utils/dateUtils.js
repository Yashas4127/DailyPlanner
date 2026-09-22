import { format, isToday, isTomorrow, isYesterday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEE, MMM d');
};

export const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const toDateInputValue = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const todayStr = () => toDateInputValue(new Date());

export const getWeekDays = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getPrevDay = (dateStr) => {
  const d = parseISO(dateStr);
  d.setDate(d.getDate() - 1);
  return toDateInputValue(d);
};

export const getNextDay = (dateStr) => {
  const d = parseISO(dateStr);
  d.setDate(d.getDate() + 1);
  return toDateInputValue(d);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
