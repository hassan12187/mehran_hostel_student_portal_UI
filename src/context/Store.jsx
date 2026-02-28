import { createContext, useContext, useState } from "react";

const StoreContext=createContext(null);

export const Store=({children})=>{
    const [token,setToken]=useState("");
    const logout=()=>{
        setToken("");
    };
    return <StoreContext value={{token,logout,setToken}}>
        {children}
    </StoreContext>
};
export const useCustom=()=>useContext(StoreContext);