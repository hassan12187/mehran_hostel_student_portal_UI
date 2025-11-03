import { jwtDecode } from "jwt-decode";

const isTokenExpired=(token)=>{
    if(!token)return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
};
export default isTokenExpired;