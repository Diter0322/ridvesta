import { API_BASE_URL } from '../config/api';

// Safe fetch wrapper that suppresses errors
const safeFetch = (url, options) => {
  return new Promise((resolve) => {
    fetch(url, options)
      .then((response) => {
        resolve(response);
      })
      .catch(() => {
        resolve({
          ok: false,
          status: 0,
        });
      });
  });
};

// Get tasks from API with Bearer token
export const fetchTasks = async (accessToken) => {
  try {
    // Validate token exists and is not empty
    if (!accessToken || accessToken.trim() === '') {
      console.error('Token is empty or null');
      return {
        success: false,
        error: 'No authentication token found',
        tasks: [],
      };
    }

    const apiUrl = `${API_BASE_URL}/task`;
    
    // Log token details for debugging
    
    const response = await safeFetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    

    if (!response.ok) {
      // Try to get error message from API
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || `Failed to fetch tasks (HTTP ${response.status})`,
          tasks: [],
        };
      } catch (e) {
        console.error('Failed to parse error response');
        return {
          success: false,
          error: `Failed to fetch tasks. Status: ${response.status}`,
          tasks: [],
        };
      }
    }

    try {
      const data = await response.json();
      
      // Handle different response structures
      let tasks = [];
      
      if (Array.isArray(data.data)) {
        // If data.data is directly an array
        tasks = data.data;
      } else if (data.data && Array.isArray(data.data.tasks)) {
        // If data.data.tasks is an array
        tasks = data.data.tasks;
      } else if (Array.isArray(data.tasks)) {
        // If data.tasks is an array
        tasks = data.tasks;
      } else if (data.data && !Array.isArray(data.data)) {
        // If data.data is an object, try to extract tasks from it
        console.warn('data.data is not an array:', data.data);
        tasks = [];
      }
      
      if (tasks.length > 0) {
      }
      
      return {
        success: true,
        tasks: Array.isArray(tasks) ? tasks : [],
        message: data.message || 'Tasks fetched successfully',
      };
    } catch (e) {
      console.error('Failed to parse tasks response:', e);
      return {
        success: false,
        error: 'Failed to parse tasks response',
        tasks: [],
      };
    }
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return {
      success: false,
      error: 'An error occurred while fetching tasks',
      tasks: [],
    };
  }
};

// Submit task completion with Bearer token
export const submitTask = async (accessToken, taskId) => {
  try {
    // Validate token exists and is not empty
    if (!accessToken || accessToken.trim() === '') {
      console.error('Token is empty or null');
      return {
        success: false,
        error: 'No authentication token found',
      };
    }

    const apiUrl = `${API_BASE_URL}/task`;
    
    // Log token details for debugging
    
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: taskId,
      }),
    });


    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || `Failed to submit task (HTTP ${response.status})`,
        };
      } catch (e) {
        console.error('Failed to parse error response');
        return {
          success: false,
          error: `Failed to submit task. Status: ${response.status}`,
        };
      }
    }

    try {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Task submitted successfully',
        reward: data.reward,
      };
    } catch (e) {
      console.error('Failed to parse task response');
      return {
        success: false,
        error: 'Failed to parse task response',
      };
    }
  } catch (error) {
    console.error('Submit task error:', error);
    return {
      success: false,
      error: 'An error occurred while submitting task',
    };
  }
};
