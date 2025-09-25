import { httpClient } from "../configuration/httpClient";
import {API} from "../configuration/configuration";
import { setToken, getToken, removeToken } from "./localStorageService";

export const logIn = async(username, password) =>{
    const response = await httpClient.post(API.LOGIN, {
        username: username,
        password : password
    })
    console.log("Response body:", response);
    setToken(response.data?.results?.token)
    return response;
}

export const logOut = ()=>{
    removeToken();
}
export const isAuthenticated = () =>{
    return getToken();
}