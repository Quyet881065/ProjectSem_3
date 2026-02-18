import { httpClient } from "../../../configuration/httpClient";
import { API } from "../../../configuration/configuration";
import { setToken, getToken, removeToken, setExpirationTime, getExpirationTime, setUserId } from "../../../service/localStorageService";

export const logIn = async (email, password) => {
    const response = await httpClient.post(API.LOGIN, {
        email: email,
        password: password
    })
    console.log("Response body:", response);
    const token = response.data?.results?.token;
    const userId = response.data?.results?.userId;
    const expirationIOS = response.data?.results?.expiryTime;
    const expiration = new Date(expirationIOS).getTime();
    console.log("Expiration time from server:", expiration);
    if (token && expiration) {
        setToken(token)
        setUserId(userId);
        setExpirationTime(expiration);
    }
    return response;
}

export const logOut = () => {
    removeToken();
}
export const isAuthenticated = () => {
    const token = getToken();
    const expirationTime = getExpirationTime();
    if (!token || !expirationTime) {
        return false;
    }
    const current = Date.now();
    // Chuyển sang giờ Việt Nam để log cho dễ nhìn
    const currentVN = new Date(current).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
    });
    const expirationVN = new Date(expirationTime).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
    });
    if (current > Number(expirationTime)) {
        removeToken();
        return false;
    }
    console.log("Current VN time:", currentVN);
    console.log("Expiration VN time:", expirationVN);
    return true;
}

// Gọi API refresh token khi sắp hết hạn
export const refreshToken = async () => {
    const oldToken = getToken();
    if (!oldToken) return;

    try {
        const response = await httpClient.post(API.REFRESH, {
            token: oldToken,
        });
        const newToken = response.data?.results?.token;
        const newExpiryISO = response.data?.results?.expiryTime;
        const newExpiry = new Date(newExpiryISO).getTime();

        if (newToken && newExpiry) {
            setToken(newToken);
            setExpirationTime(newExpiry);
            console.log(" Token refreshed successfully!");
        }
    } catch (error) {
        console.error(" Refresh token failed:", error);
        logOut();
    }
};