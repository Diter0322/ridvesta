import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Create a wrapper fetch that doesn't expose URLs to console
const safeFetch = (url, options) => {
  return new Promise((resolve) => {
    fetch(url, options)
      .then((response) => {
        // Don't throw, just return the response
        resolve(response);
      })
      .catch(() => {
        // Silently catch, don't let error propagate to console
        resolve({
          ok: false,
          status: 0,
        });
      });
  });
};

export const loginUser = async (phone, password) => {
  try {
    const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
    
    // Send as JSON instead of FormData
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
        password_confirmation: password, // Required for Laravel's 'confirmed' validation
      }),
    });

    if (!response.ok) {
      // Try to get detailed error message from API
      try {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Invalid credentials';
        
        // If there are validation errors, return them
        if (errorData.errors) {
          const fieldErrors = Object.values(errorData.errors).flat();
          return {
            success: false,
            error: fieldErrors[0] || errorMessage,
          };
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      } catch (e) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }
    }

    try {
      const data = await response.json();
      
      // API returns token in data.data.access_token
      const token = data.data?.access_token || data.access_token || data.token;
      const user = data.data?.user || data.user || { phone };
      
      if (!token) {
        // console.error('No token found in API response');
        return {
          success: false,
          error: 'No token received from server',
        };
      }
      
      // console.log('Token extracted:', token.substring(0, 30) + '...');
      
      return {
        success: true,
        accessToken: token,
        user: user,
      };
    } catch (e) {
      // console.error('Error parsing login response:', e);
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid credentials',
    };
  }
};

export const signupUser = async (fullname, phone, password, passwordConfirmation, refId = null) => {
  try {
    const body = {
      phone: phone,
      fullname: fullname,
      password: password,
      password_confirmation: passwordConfirmation,
    };

    if (refId !== null && refId !== undefined && refId !== '') {
      body.ref_id = refId;
    }

    const apiUrl = `${API_BASE_URL}/register`;
    
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Try to get detailed error message from API
      try {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Signup failed. Please try again.';
        
        // If there are validation errors, return them
        if (errorData.errors) {
          const fieldErrors = Object.values(errorData.errors).flat();
          return {
            success: false,
            error: fieldErrors[0] || errorMessage,
            errors: errorData.errors,
          };
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      } catch (e) {
        // If we can't parse error response, return generic message
        return {
          success: false,
          error: 'Signup failed. Please try again.',
        };
      }
    }

    try {
      const data = await response.json();
      
      // API returns token in data.data.access_token
      const token = data.data?.access_token || data.access_token || data.token;
      const user = data.data?.user || data.user || { phone, fullname };
      
      if (!token) {
        console.error('No token found in signup response');
        return {
          success: true, // Signup successful even without token
          message: data.message || 'Signup successful',
          accessToken: null,
          user: user,
        };
      }
      
      // console.log('Token extracted:', token.substring(0, 30) + '...');
      
      return {
        success: true,
        message: data.message || 'Signup successful',
        accessToken: token,
        user: user,
      };
    } catch (e) {
      console.error('Error parsing signup response:', e);
      return {
        success: false,
        error: 'Signup failed. Please try again.',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Signup failed. Please try again.',
    };
  }
};
