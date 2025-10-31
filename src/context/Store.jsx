import { createContext, useContext, useState } from "react";

const StoreContext=createContext(null);

export const Store=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const addToken=(token)=>{
        setToken(token);
        localStorage.setItem("token",token);
    };
    return <StoreContext value={{token,addToken}}>
        {children}
    </StoreContext>
};
export const useCustom=()=>useContext(StoreContext);