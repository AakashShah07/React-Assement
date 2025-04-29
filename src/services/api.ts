import axios from 'axios';
import { ListItem } from '../types';

const API_URL = 'https://apis.ccbp.in/list-creation/lists';

export const fetchLists = async (): Promise<{ [key: string]: ListItem[] }> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};