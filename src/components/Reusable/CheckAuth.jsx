import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustom } from "../../context/Store";

const CheckAuth=({children})=>{
    const {token}=useCustom();
    const navigate=useNavigate();
    useEffect(()=>{
        if(!token) navigate('/login');
    },[]);
    return children;
};
export default CheckAuth;