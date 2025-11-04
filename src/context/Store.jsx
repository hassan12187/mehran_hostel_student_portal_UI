import { createContext, useContext, useState } from "react";

const StoreContext=createContext(null);

export const Store=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const addToken=(token)=>{
        setToken(token);
        localStorage.setItem("token",token);
    };
    const logout=()=>{
        localStorage.removeItem("token");
        setToken("");
    };
    return <StoreContext value={{token,addToken,logout,setToken}}>
        {children}
    </StoreContext>
};
export const useCustom=()=>useContext(StoreContext);