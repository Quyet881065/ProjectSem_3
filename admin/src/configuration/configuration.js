
export const CONFIG = {
    API_GATEWAY : import.meta.env.VITE_BACKEND_URL,
};

export const API = {
    CONVERSATION : "/conversations/all",
    CONVERSATIONCREATE : "/conversations/create",
    MESSAGE : "/messages",
    MESSAGECREATE : "/messages/create",
    REFRESH : "/auth/refresh",
    LOGIN : "/auth/login",
}