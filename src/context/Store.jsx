import { createContext, useContext, useState } from "react";

const StoreContext=createContext(null);

export const Store=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));

    return <StoreContext value={{token,setToken}}>
        {children}
    </StoreContext>
};
export const useCustom=()=>useContext(StoreContext);