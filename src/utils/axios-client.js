import axios from 'axios';

export const createAxiosClient = ({ baseURL, headers = {}, token, interceptResponses = true }) => {
    const client = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
    });

    if (token) {
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    // Simple response interceptor
    if (interceptResponses) {
        client.interceptors.response.use(
            (response) => response.data,
            (error) => {
                const message = error.response?.data?.message || error.message;
                const customError = new Error(message);
                customError.status = error.response?.status;
                customError.data = error.response?.data;
                return Promise.reject(customError);
            }
        );
    }
    
    return client;
};
