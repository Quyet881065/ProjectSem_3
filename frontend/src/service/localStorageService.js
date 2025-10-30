

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

export const setExpirationTime = (expiration) => {
    localStorage.setItem("expirationTime", expiration);
}
export const getExpirationTime = ()=> {
    const time = localStorage.getItem("expirationTime");
    return time ? Number(time) : null;
}
