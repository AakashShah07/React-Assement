import axios from 'axios';

const API_URL = 'https://apis.ccbp.in/list-creation/lists';

export const fetchLists = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};