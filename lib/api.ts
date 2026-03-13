import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for secure cookies
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('lms_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auto-refresh token on 401/403
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 or 403 and we haven't already retried this original request
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Ignore the refresh loop if the failed request WAS the refresh request
                if (originalRequest.url === '/api/auth/refresh') {
                    throw error;
                }

                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/refresh`, {}, {
                    withCredentials: true // send the HttpOnly cookie
                });

                if (res.data?.accessToken) {
                    const newToken = res.data.accessToken;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('lms_token', newToken);
                        // Also try to update user if possible, but context handles it mostly.
                    }
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest); // Retry the request with new token
                }
            } catch (refreshError) {
                // Refresh failed meaning session is completely dead. Clear state.
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('lms_token');
                    localStorage.removeItem('lms_user');
                    window.location.href = '/login?session_expired=true';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (data: any) => api.post('/api/auth/register', data),
    login: (data: any) => api.post('/api/auth/login', data),
    refresh: () => api.post('/api/auth/refresh'),
    logout: () => api.post('/api/auth/logout'),
};

// Subjects API
export const subjectsApi = {
    getAll: () => api.get('/api/subjects'),
    getById: (id: number) => api.get(`/api/subjects/${id}`),
    getTree: (id: number) => api.get(`/api/subjects/${id}/tree`),
};

// Videos API
export const videosApi = {
    get: (id: number) => api.get(`/api/videos/${id}`),
    getFirstVideo: (subjectId: number) => api.get(`/api/videos/subjects/${subjectId}/first-video`),
};

// Enrollments API
export const enrollmentApi = {
    enroll: (subjectId: number) => api.post(`/api/enrollments/${subjectId}`),
    getMyEnrollments: () => api.get('/api/enrollments'),
};

// Progress API
export const progressApi = {
    get: (videoId: number) => api.get(`/api/progress/videos/${videoId}`),
    save: (videoId: number, data: { last_position_seconds: number; is_completed: boolean }) =>
        api.post(`/api/progress/videos/${videoId}`, data),
    getSubjectProgress: (subjectId: number) => api.get(`/api/progress/subjects/${subjectId}`),
};

export default api;
