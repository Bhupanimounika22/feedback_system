import axios from 'axios';

const API_URL = 'https://feedback-backend-0ziu.onrender.com/api' ||  'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add a global response interceptor for 403 errors
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            // Show a user-friendly alert (can be replaced with a Snackbar or custom UI)
            alert('You are not authorized to perform this action. Please log in with the correct account.');
        }
        // Always reject so the calling code can handle it too
        return Promise.reject(error);
    }
);

// Auth
export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const register = (userData) => axios.post(`${API_URL}/register`, userData);

// Team
export const getTeam = (managerId) => axios.get(`${API_URL}/team/${managerId}`, { headers: getAuthHeaders() });
export const addTeamMember = (managerId, employeeId) => axios.post(`${API_URL}/team`, { manager_id: managerId, employee_id: employeeId }, { headers: getAuthHeaders() });
export const removeTeamMember = (managerId, employeeId) => axios.delete(`${API_URL}/team`, { data: { manager_id: managerId, employee_id: employeeId }, headers: getAuthHeaders() });
export const getTeamMembers = (managerId) => axios.get(`${API_URL}/team/members/${managerId}`,{ headers: getAuthHeaders() });

// Feedback
export const getEmployeeFeedback = (employeeId) => axios.get(`${API_URL}/feedback/employee/${employeeId}`, { headers: getAuthHeaders() });
export const getManagerFeedback = (managerId) => axios.get(`${API_URL}/feedback/manager/${managerId}`, { headers: getAuthHeaders() });
export const getFeedback = (feedbackId) => axios.get(`${API_URL}/feedback/${feedbackId}`, { headers: getAuthHeaders() });
export const submitFeedback = (feedbackData) => axios.post(`${API_URL}/feedback`, feedbackData, { headers: getAuthHeaders() });
export const editFeedback = (feedbackId, feedbackData) => axios.put(`${API_URL}/feedback/${feedbackId}`, feedbackData, { headers: getAuthHeaders() });
export const deleteFeedback = (feedbackId) => axios.delete(`${API_URL}/feedback/${feedbackId}`, { headers: getAuthHeaders() });
export const requestFeedback = (requestData) => axios.post(`${API_URL}/feedback/request`, requestData, { headers: getAuthHeaders() });
export const acknowledgeFeedback = (ackData) => axios.post(`${API_URL}/feedback/acknowledge`, ackData, { headers: getAuthHeaders() });

// Comments
export const addComment = (commentData) => axios.post(`${API_URL}/comments`, commentData, { headers: getAuthHeaders() });
export const getComments = (feedbackId) => axios.get(`${API_URL}/comments/${feedbackId}`, { headers: getAuthHeaders() });

// Feedback Requests
export const getFeedbackRequests = (userId) => axios.get(`${API_URL}/feedback/requests/${userId}`, { headers: getAuthHeaders() });
export const updateFeedbackRequestStatus = (requestId, data) => axios.put(`${API_URL}/feedback/request/${requestId}`, data, { headers: getAuthHeaders() });
export const getEmployeeFeedbackRequests = (employeeId) => axios.get(`${API_URL}/feedback/requests/employee/${employeeId}`, { headers: getAuthHeaders() });

// Acknowledgements
export const getAcknowledgements = (feedbackId) => axios.get(`${API_URL}/feedback/acknowledgements/${feedbackId}`, { headers: getAuthHeaders() });

// Tags
export const getFeedbackTags = (feedbackId) => axios.get(`${API_URL}/feedback/tags/${feedbackId}`, { headers: getAuthHeaders() });
export const addFeedbackTag = (tagData) => axios.post(`${API_URL}/feedback/tags`, tagData, { headers: getAuthHeaders() });
export const deleteFeedbackTag = (tagId) => axios.delete(`${API_URL}/feedback/tags/${tagId}`, { headers: getAuthHeaders() });

// Statistics
export const getManagerStats = (managerId) => axios.get(`${API_URL}/feedback/stats/${managerId}`, { headers: getAuthHeaders() });
export const getEmployeeStats = (employeeId) => axios.get(`${API_URL}/feedback/employee/stats/${employeeId}`, { headers: getAuthHeaders() });

// Users
export const getUsers = (role = '') => {
    const params = role ? { params: { role } } : {};
    return axios.get(`${API_URL}/users`, { ...params, headers: getAuthHeaders() });
};
export const getUser = (userId) => axios.get(`${API_URL}/user/${userId}`, { headers: getAuthHeaders() }); 
