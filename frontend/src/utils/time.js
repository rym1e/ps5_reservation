import dayjs from 'dayjs';
import { getServerTime } from '@/services/http';

export function roundToNextHour(time) {
  return dayjs(time).add(1, 'hour').startOf('hour');
}

export function formatDateTime(value, pattern = 'YYYY-MM-DD HH:mm') {
  return dayjs(value).format(pattern);
}

export function getNowFromServer() {
  return dayjs(getServerTime());
}
