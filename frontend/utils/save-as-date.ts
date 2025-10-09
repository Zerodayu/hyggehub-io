/**
 * Utility functions for handling date formatting for database storage
 */

/**
 * Formats a date string from the date picker into ISO format for database storage
 * @param dateString - The date string from the date picker component
 * @returns ISO formatted date string or empty string if invalid
 */
export function formatDateForDatabase(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    // Convert the date string to a Date object
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Return the ISO string format that databases typically accept
    return date.toISOString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

/**
 * Formats a date string for display purposes
 * @param dateString - ISO date string from database
 * @returns Formatted date string (e.g. "October 10, 2025")
 */
export function formatDateForDisplay(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return '';
  }
}