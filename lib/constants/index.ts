export const APP_NAME = "My Calendar";
export const APP_DESCRIPTION = 'A calendar site for you';

export const PUBLIC_NAV_ROUTES = [
  { route: '/', title: 'home' },
];

export const PRIVATE_USER_NAV_ROUTES = [
  { route: '/calendar', title: 'calendar' },
];

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user'];

export const EVENT_TYPE_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  VEVENT: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  VTODO: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  VJOURNAL: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' },
  VFREEBUSY: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  UNKNOWN: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' },
};

export const PRIORITY_COLORS: { [key: number]: string } = {
  1: 'border-l-4 border-red-500',
  2: 'border-l-4 border-red-400',
  3: 'border-l-4 border-orange-500',
  4: 'border-l-4 border-orange-400',
  5: 'border-l-4 border-yellow-500',
  6: 'border-l-4 border-yellow-400',
  7: 'border-l-4 border-green-500',
  8: 'border-l-4 border-green-400',
  9: 'border-l-4 border-blue-500',
};

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',   // US East
  'America/Chicago',    // US Central
  'America/Denver',     // US Mountain
  'America/Los_Angeles',// US Pacific
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
];