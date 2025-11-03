import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustom } from "../../context/Store";
import isTokenExpired from "../../services/IsExpired";

const CheckAuth=({children})=>{
    const {token,addToken}=useCustom();
    const navigate=useNavigate();
         useEffect(()=>{
          const verifyToken=async()=>{
            if(!token){
              try {
                const res = await Axios.post("/refresh-token",{},{
                  withCredentials:true
                });
                addToken(res.data.accessToken);
              } catch (error) {
                console.log(error);
                navigate('/login');
              }
            }
               if(isTokenExpired(token)){
              try {
                const res = await Axios.post("/refresh-token",{},{
                  withCredentials:true
                });
                addToken(res.data.accessToken);
              } catch (error) {
                console.log(error);
                navigate('/login');
              }
            };
          };
      verifyToken();
        },[token])
    return children;
};
export default CheckAuth;