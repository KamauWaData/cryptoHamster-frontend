import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { apiClient } from '@/integrations/client'; // Axios client for Django API
import { Article } from '@/integrations/types';

// Function to check for new article content
export const checkForNewArticleContent = async (): Promise<Article[]> => {
  try {
    const response = await apiClient.get('articles/');
    return response.data; // Return the list of articles
  } catch (error) {
    console.error('Error checking for new article content:', error);
    throw error;
  }
};

// Function to set up auto content updates (polling mechanism)
export const setupAutoContentUpdates = (callback: () => void, interval = 10000): (() => void) => {
  const intervalId = setInterval(callback, interval); // Call the callback every `interval` ms
  return () => clearInterval(intervalId); // Return a cleanup function
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
