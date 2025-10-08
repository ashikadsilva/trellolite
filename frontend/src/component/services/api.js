import keycloakAuth from "../keycloak/keycloakAuth";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8081",
    headers: {
        "Content-Type": "application/json"
    },
});

// Add request interceptor to attach token
api.interceptors.request.use(async (config) => {
    if (keycloakAuth?.authenticated) {
        try {
            await keycloakAuth.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloakAuth.token}`;
        } catch {
            keycloakAuth.logout({ redirectUri: window.location.origin });
        }
    }
    return config;
}, (error) => Promise.reject(error));


export const BoardAPI = {
  getBoards: (userId) => api.get(`/api/boards?userId=${userId}`),
  createBoard: (data) => api.post(`/api/boards`, data),
  updateBoard: (id, data) => api.put(`/api/boards/${id}`, data),
  deleteBoard: (id) => api.delete(`/api/boards/${id}`),
};

export const ListAPI = {
  getLists: (listId) => api.get(`/api/lists?listId=${listId}`),
  createList: (data) => api.post(`/api/lists`, data),
  updateList: (id, data) => api.put(`/api/lists/${id}`, data),
  deleteList: (id) => api.delete(`/api/lists/${id}`),
};

export const CardAPI = {
  getCards: (listId) => api.get(`/api/cards?listId=${listId}`),
  createCard: (data) => api.post(`/api/cards`, data),
  updateCard: (id, data) => api.put(`/api/cards/${id}`, data),
  deleteCard: (id) => api.delete(`/api/cards/${id}`),
  reorderCards: (data) => api.put(`/api/cards/reorder`, data),
};

export default api;