import axios from 'axios'
import { CONFIG, API } from './configuration'
import { getToken, setToken, setExpirationTime } from '../service/localStorageService';
import { getExpirationTime } from '../service/localStorageService';

export const httpClient = axios.create({
    baseURL: CONFIG.API_GATEWAY,
    headers: {
        'Content-Type': 'application/json'
    }
})

httpClient.interceptors.request.use(async (config) => {
    const token = getToken();
    const expiration = getExpirationTime();

    if (token && expiration) {
        const currentTime = Date.now();
        const expireTime = new Date(expiration).getTime();
        const timeLeft = expireTime - currentTime;

        //  Nếu còn dưới 1 phút, tự động gọi API refresh
        if (timeLeft < 60 * 1000 && timeLeft > 0) {
            console.log("🔄 Token sắp hết hạn, tiến hành refresh...");

            try {
                // Gọi API refresh trực tiếp (dùng axios gốc để tránh vòng lặp interceptor)
                const res = await axios.post(`${CONFIG.API_GATEWAY}${API.REFRESH}`, {
                    token,
                });

                const newToken = res.data?.results?.token;
                const newExpiry = res.data?.results?.expiryTime;

                if (newToken && newExpiry) {
                    setToken(newToken);
                    setExpirationTime(new Date(newExpiry).getTime());
                    console.log("✅ Token đã được refresh thành công!");

                    // Gán token mới vào header
                    config.headers.Authorization = `Bearer ${newToken}`;
                }
            } catch (error) {
                console.error(" Refresh token thất bại:", error);
                removeToken();
            }
        } else {
            // Token còn hạn → thêm vào header
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});