/**
 * Format a date string to a localized format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Format a date string to a localized date and time format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
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
