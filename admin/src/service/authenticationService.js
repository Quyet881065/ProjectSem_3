import { API } from "../configuration/configuration"
import { httpClient } from "../configuration/httpClient"
import { setExpirationTime, setToken } from "./localStorageService";

export const logIn = async (email, password) => {
    const response = await httpClient.post(API.LOGIN, {
        email : email,
        password : password
    })
    console.log(response)
    const data = response.data;
    const token = data.results.token;
    const expirationIOS = data.results.expiryTime;
    const expiration = new Date(expirationIOS).getTime();
    console.log(data)
    if(data.statusCode === 200 && data.results.role === "ROLE_ADMIN"){
        setToken(token);
        setExpirationTime(expiration);
    }
    return data;
}