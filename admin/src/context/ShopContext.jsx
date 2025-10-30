import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

export const ShopContextProvider = props => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const value = {backendurl, navigate};

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}