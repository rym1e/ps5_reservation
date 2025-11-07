const ONE_HOUR = 60 * 60 * 1000;

export function alignToNextHour(timestamp) {
  const date = new Date(timestamp);
  if (date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
    return date.getTime();
  }
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date.getTime();
}

export function generateHourSlots(start, hours) {
  const slots = [];
  for (let i = 0; i < hours; i += 1) {
    const startTime = start + i * ONE_HOUR;
    slots.push({
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(startTime + ONE_HOUR).toISOString()
    });
  }
  return slots;
}

export function formatSlotRange(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const startDate = `${start.getMonth() + 1}/${start.getDate()}`;
  const startHour = `${start.getHours().toString().padStart(2, '0')}:00`;
  const endHour = `${end.getHours().toString().padStart(2, '0')}:00`;
  return `${startDate} ${startHour} - ${endHour}`;
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function diffInSeconds(expireAt, now = Date.now()) {
  const target = typeof expireAt === 'string' ? new Date(expireAt).getTime() : expireAt;
  return Math.max(0, Math.floor((target - now) / 1000));
}

export function formatCountdown(seconds) {
  const mm = `${Math.floor(seconds / 60)}`.padStart(2, '0');
  const ss = `${seconds % 60}`.padStart(2, '0');
  return `${mm}:${ss}`;
}
