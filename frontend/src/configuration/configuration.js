
export const OAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  authUri: import.meta.env.VITE_GOOGLE_AUTH_URI,
};

export const CONFIG = {
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY,
};


export const API = {
  REGISTER : "/users/register",
  LOGIN : "/auth/login",
  MY_INFO : "/users/my-profile",
  MY_POSTS : "/post/my-posts",
   SEARCH_USER: "/profile/users/search",
  MY_CONVERSATIONS: "/chat/conversations/my-conversations",
  CREATE_CONVERSATION: "/chat/conversations/create",
   CREATE_MESSAGE: "/chat/messages/create",
  GET_CONVERSATION_MESSAGES: "/chat/messages",
  REFRESH : "/auth/refresh",
  GET_MY_CONVERSATIONS: "/conversations/my-conversations",
  SEND_MESSAGE: "/message/create",
  FETCH_MESSAGES: "/message",
  CREATE_CONVERSATIONS: "/conversations/create",
}

// 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
