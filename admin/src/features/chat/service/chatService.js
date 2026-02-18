import { httpClient } from "../../../configuration/httpClient"
import { API } from "../../../configuration/configuration"
import { getToken } from "../../../service/localStorageService";

export const fetchConversations = async () => {
    const token = getToken();
    console.log("TOKEN:", token);
    const response = await httpClient.get(API.CONVERSATION, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const createCoversation = async (userId) => {
    const response = await httpClient.post(API.CONVERSATIONCREATE, {
        userId: userId
    });
    return response.data;
}

export const fetchMessages = async (conversationId) => {
    const response = await httpClient.get(API.MESSAGE, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        params: {
            conversationId: conversationId
        }
    });
    return response.data;
};


export const sendMessage = async (conversationId, message) => {
    const response = await httpClient.post(API.MESSAGECREATE, {
        conversationId,
        message
    },{
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    return response.data;
}