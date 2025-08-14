import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a date string to local date string without timezone issues
 * This ensures the date displayed matches what was stored in the database
 */
export function formatDateToLocal(dateString: string): string {
  if (!dateString) return ''
  
  try {
    // Create a date object from the string
    const date = new Date(dateString)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    // Format as YYYY-MM-DD in local timezone
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Convert a date string to a display-friendly format
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date for display:', error)
    return dateString
  }
}

/**
 * Ensure a date string is properly formatted for database storage
 */
export function normalizeDateForDatabase(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    // Return the date in YYYY-MM-DD format
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error normalizing date:', error)
    return dateString
  }
}
