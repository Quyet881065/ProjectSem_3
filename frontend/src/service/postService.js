
import { httpClient } from "../configuration/httpClient";
import { API } from "../configuration/configuration";
import {getToken} from "./localStorageService"

export const getMyPosts = async(page) => {
    const token = getToken();
  console.log("🔑 Token gửi đi:", token);
    return await httpClient.get(API.MY_POSTS, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        params:{
            page:page,
            size: 2,
        }
    })
}