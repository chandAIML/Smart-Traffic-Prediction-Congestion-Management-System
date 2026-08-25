import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle common API errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `API Error ${error.response.status}:`,
                error.response.data
            );

            // Token expired / invalid
            if (error.response.status === 401) {
                console.warn("Authentication required.");
            }

            // Permission denied
            if (error.response.status === 403) {
                console.warn("Access denied.");
            }
        } else {
            console.error("Network Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;