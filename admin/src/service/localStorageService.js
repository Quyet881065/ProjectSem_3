
const KEY_TOKEN = 'token';

export const setToken = (token)=> {
    localStorage.setItem(KEY_TOKEN, token)
}
export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN)
}

export const removeToken = () => {
    localStorage.removeItem(KEY_TOKEN);
}

export const setExpirationTime = (expiration)=>{
    localStorage.setItem("expiration", expiration);
}

export const getExpirationTime = () => {
    const time = localStorage.getItem("expiration");
    return time ? Number(time) : null ;
}