/**
 * API Configuration
 */

// Backend API base URL (for API calls)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Image base URL (for static images - no /api path)
export const IMAGE_BASE_URL = 'http://localhost:8080'

// Placeholder image for missing files
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="18" fill="%239ca3af"%3EImage Not Available%3C/text%3E%3C/svg%3E'

// Construct full image URL
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '' // Return empty string for no image
  }

  // If imagePath is already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // If imagePath starts with /, prepend IMAGE_BASE_URL directly
  if (imagePath.startsWith('/')) {
    return `${IMAGE_BASE_URL}${imagePath}`
  }

  // Otherwise, prepend IMAGE_BASE_URL with /images/
  return `${IMAGE_BASE_URL}/images/${imagePath}`
}
