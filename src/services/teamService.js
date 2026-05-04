import { API_BASE_URL } from '../config/api';

const safeFetch = (url, options) =>
  new Promise((resolve) => {
    fetch(url, options)
      .then(resolve)
      .catch(() => resolve({ ok: false, status: 0 }));
  });

// GET /api/team  – main team data + share link + QR
export const fetchTeam = async (accessToken) => {
  try {
    if (!accessToken || accessToken.trim() === '') {
      return { success: false, error: 'No authentication token found', data: null };
    }

    const response = await safeFetch(`${API_BASE_URL}/team`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      try {
        const err = await response.json();
        return { success: false, error: err.message || `HTTP ${response.status}`, data: null };
      } catch {
        return { success: false, error: `HTTP ${response.status}`, data: null };
      }
    }

    const json = await response.json();
    return { success: true, data: json.data || null };
  } catch (e) {
    return { success: false, error: 'Network error', data: null };
  }
};

// GET /api/team/summary  – per-level breakdown
export const fetchTeamSummary = async (accessToken) => {
  try {
    if (!accessToken || accessToken.trim() === '') {
      return { success: false, error: 'No authentication token found', levels: [] };
    }

    const response = await safeFetch(`${API_BASE_URL}/team/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      try {
        const err = await response.json();
        return { success: false, error: err.message || `HTTP ${response.status}`, levels: [] };
      } catch {
        return { success: false, error: `HTTP ${response.status}`, levels: [] };
      }
    }

    const json = await response.json();
    return { success: true, levels: json.data?.levels || [], data: json.data || null };
  } catch (e) {
    return { success: false, error: 'Network error', levels: [] };
  }
};
