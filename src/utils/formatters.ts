/**
 * Format a date string to a localized format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Format a date string to a localized DD:MM:YYYY
export const formatDateToDDMMYYYY = (dateInput: string | number | Date): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '-';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}:${month}:${year}`;
};

/**
 * Format a date string to a localized date and time format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Format a date string to only time in 12-hour AM/PM format (e.g., "2:30 PM")
 */
export function formatTimeAMPM(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export const formatDateTimeTable = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '');
};

/**
 * Format a phone number to a standard format: +1 (555) 123-4567
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // If already formatted or not a US/Canada number, return as is
  if (phoneNumber.includes('(') || !phoneNumber.startsWith('+1')) {
    return phoneNumber;
  }

  // Remove any non-numeric characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if we have enough digits for US/Canada formatting
  if (digitsOnly.length < 10) {
    return phoneNumber;
  }

  // Format as +1 (XXX) XXX-XXXX
  const countryCode = digitsOnly.slice(0, 1);
  const areaCode = digitsOnly.slice(1, 4);
  const prefix = digitsOnly.slice(4, 7);
  const lineNumber = digitsOnly.slice(7, 11);

  return `+${countryCode} (${areaCode}) ${prefix}-${lineNumber}`;
}

/**
 * Format a duration in seconds to a readable format: HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Convert a phone duration string (MM:SS) to seconds
 */
export function durationToSeconds(duration: string): number {
  const parts = duration.split(':');

  if (parts.length === 2) {
    // MM:SS format
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }

  return 0;
}

export const formatDurationToHours = (minutes: string | undefined): string => {
  const minutesNum = Number(minutes) || 0;
  if (minutesNum < 0) return '00:00';

  const hours = Math.floor(minutesNum / 60);
  const remainingMinutes = Math.floor(minutesNum % 60);

  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
};

/**
 * Convert milliseconds to a readable minutes format: MM:SS
 */
export function formatMillisecondsToMinutes(milliseconds: number | string | undefined | null): string {
  // Handle undefined, null, or invalid inputs
  if (milliseconds == null || isNaN(Number(milliseconds))) {
    return '00:00';
  }

  const ms = typeof milliseconds === 'string' ? parseInt(milliseconds, 10) : milliseconds;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Convert milliseconds to a readable hours format: HH:MM:SS
 */
export function formatMillisecondsToHours(milliseconds: number | string | undefined | null): string {
  // Handle undefined, null, or invalid inputs
  if (milliseconds == null || isNaN(Number(milliseconds))) {
    return '00:00:00';
  }

  const ms = typeof milliseconds === 'string' ? parseInt(milliseconds, 10) : milliseconds;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Convert milliseconds to seconds
 */
export function formatMillisecondsToSeconds(milliseconds: number | string | undefined | null): number {
  // Handle undefined, null, or invalid inputs
  if (milliseconds == null || isNaN(Number(milliseconds))) {
    return 0;
  }

  const ms = typeof milliseconds === 'string' ? parseInt(milliseconds, 10) : milliseconds;
  return Math.floor(ms / 1000);
}