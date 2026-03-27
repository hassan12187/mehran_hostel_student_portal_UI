import { createContext, useContext, useState, type ReactNode} from "react";

interface StoreState{
    token:string|null,
    setToken:(t:string|null)=>void
};

const StoreContext=createContext<StoreState|null>(null);

export const Store=({children}:{children:ReactNode})=>{
    const [token,setToken]=useState<string | null>(null);
    return <StoreContext.Provider value={{token,setToken}}>
        {children}
    </StoreContext.Provider>
};
export const useCustom=():StoreState=>{
    const ctx = useContext(StoreContext);
    if(!ctx)throw new Error("Store context error");
    return ctx;
};