import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// This function is executed before sending of request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// This function is executed after the recieving of response
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
            }
        } catch (e) {
            console.error(e);
        }

        throw error;
    }
);

export default axiosClient;
