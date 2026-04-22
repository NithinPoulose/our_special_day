const PUSH_TIME_ZONE = process.env.PUSH_TIME_ZONE ?? 'Asia/Kolkata';
const RANDOM_WINDOW_START_MINUTE = 10 * 60;
const RANDOM_WINDOW_END_MINUTE = 22 * 60;
const RANDOM_INTERVAL_MINUTES = 5;

function getTimeParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PUSH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hour = Number(values.hour);
  const minute = Number(values.minute);
  const second = Number(values.second);

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    hour,
    minute,
    second,
    minuteOfDay: hour * 60 + minute,
    secondOfDay: hour * 3600 + minute * 60 + second,
  };
}

function formatMinuteOfDay(minuteOfDay) {
  const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, '0');
  const minutes = String(minuteOfDay % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatSecondOfDay(secondOfDay) {
  const hours = String(Math.floor(secondOfDay / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondOfDay % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondOfDay % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function createRandomTargetMinute() {
  const totalSteps =
    (RANDOM_WINDOW_END_MINUTE - RANDOM_WINDOW_START_MINUTE) / RANDOM_INTERVAL_MINUTES;
  const randomStep = Math.floor(Math.random() * (totalSteps + 1));

  return RANDOM_WINDOW_START_MINUTE + randomStep * RANDOM_INTERVAL_MINUTES;
}

module.exports = {
  PUSH_TIME_ZONE,
  RANDOM_WINDOW_START_MINUTE,
  RANDOM_WINDOW_END_MINUTE,
  RANDOM_INTERVAL_MINUTES,
  getTimeParts,
  formatMinuteOfDay,
  formatSecondOfDay,
  createRandomTargetMinute,
};