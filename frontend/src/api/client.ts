import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface HealthResponse {
    status: string;
}

export interface HelloResponse {
    message: string;
}

export const api = {
    health: async (): Promise<HealthResponse> => {
        const response = await apiClient.get<HealthResponse>('/health');
        return response.data;
    },

    hello: async (): Promise<HelloResponse> => {
        const response = await apiClient.get<HelloResponse>('/');
        return response.data;
    },
};

export default api;
