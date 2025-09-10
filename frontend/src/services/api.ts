import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Depense {
  id: number;
  nom: string;
  montant: number;
  date: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const loginUser = (data: UserLogin): Promise<{ data: AuthResponse }> => {
    return api.post<AuthResponse>("/auth/login", data);
  };
export const registerUser = (data: UserLogin) => api.post<AuthResponse>("/auth/register", data);
export const getDepenses = () => api.get<Depense[]>("/depenses");
export const addDepense = (data: Omit<Depense, "id" | "date">) => api.post("/depenses", data);
