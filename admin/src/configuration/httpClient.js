import axios from "axios";
import { API, CONFIG } from "./configuration";
import { getExpirationTime, getToken, setExpirationTime, setToken } from "../service/localStorageService";

export const httpClient = axios.create({
    baseURL: CONFIG.API_GATEWAY,
    headers: {
        'Content-Type': 'application/json'
    }
})

// interceptors chay truoc moi request 
httpClient.interceptors.request.use(async (config) => {
    const token = getToken();
    const expiration = getExpirationTime();
    if (token && expiration) {
        const currentTime = Date.now();
        const expiraTime = new Date(expiration).getTime();
        const leftTime = expiraTime - currentTime;
        if (leftTime < 60 * 1000 && leftTime > 0) {  // Neu con duoi 1 phut tu dong goi API refresh 
            console.log("Token sap het han tien hanh refresh ...")
            try {
                // Gọi API refresh trực tiếp (dùng axios gốc để tránh vòng lặp interceptor)
                const response = await axios.post(`${CONFIG.API_GATEWAY}${API.REFRESH}`, {
                    token
                })
                const newToken = response.data.results.token;
                const newExpirationTime = response.data.results.expiryTime;
                if(newToken && newExpirationTime){
                    setToken(newToken);
                    setExpirationTime(newExpirationTime);
                    console.log("Token da duoc refresh thanh cong ");
                    // Gan token moi vao headers 
                    config.headers.Authorization = `Bearer ${newToken}`;
                }
            } catch (error) {
                console.error("refresh token that bai ", error);

            }
        }else{
            // Token con han gan vao headers
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config;
})