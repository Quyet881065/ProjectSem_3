
import { httpClient } from "../configuration/httpClient";
import {API} from "../configuration/configuration";
import { getToken } from "./localStorageService";

export const getMyInfo = async()=>{
    return await httpClient.get(API.MY_INFO,{
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
}

export const updateProfile = async (profileData) => {
  return await httpClient.put(API.UPDATE_PROFILE, profileData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
};

export const uploadAvatar = async (formData) => {
  return await httpClient.put(API.UPDATE_AVATAR, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const search = async (keyword) => {
  return await httpClient.post(
    API.SEARCH_USER,
    { keyword: keyword },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }
  );
};