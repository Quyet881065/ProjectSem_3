import { httpClient } from "../../../configuration/httpClient";
import { API } from "../../../configuration/configuration";
import { getToken } from "../../../service/localStorageService";

export const sendChatMessage = async (conversationId, message, senderId) => {
    const response = await httpClient.post(API.SEND_MESSAGE, {
        conversationId,
        message,
        senderId
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const fetchMessages = async (conversationId) => {
    const response = await httpClient.get(
        `${API.FETCH_MESSAGES}?conversationId=${conversationId}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};


export const fetchConversations = async() => {
    const response = await httpClient.get(API.GET_MY_CONVERSATIONS , {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const createConversation = async(type,participantIds) => {
    const response = await httpClient.post(API.CREATE_CONVERSATIONS , {
        participantIds,
        type
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}