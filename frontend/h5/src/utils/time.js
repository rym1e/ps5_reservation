import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

export function formatSlotRange(start, end) {
  return `${dayjs(start).format('MM月DD日 HH:mm')} - ${dayjs(end).format('HH:mm')}`;
}

export function formatFullTimestamp(value) {
  return dayjs(value).format('YYYY-MM-DD HH:mm');
}

export function secondsToClock(seconds) {
  const s = Math.max(0, seconds);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(Math.floor(s % 60)).padStart(2, '0');
  return `${mm}:${ss}`;
}
