

export const KEY_TOKEN = "accessToken"

export const setToken = (token) => {
    localStorage.setItem(KEY_TOKEN, token)
}

export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN)
}

export const removeToken =() => {
    localStorage.removeItem(KEY_TOKEN)
    localStorage.removeItem("expirationTime");

}

export const setUserId = (userId) => {
    localStorage.setItem("userId", userId);
}
export const getUserId = () => {
    return localStorage.getItem("userId");
}

export const setExpirationTime = (expiration) => {
    localStorage.setItem("expirationTime", expiration);
}
export const getExpirationTime = ()=> {
    const time = localStorage.getItem("expirationTime");
    return time ? Number(time) : null;
}
