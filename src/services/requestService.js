import Axios from "../components/Reusable/Axios";

export const GetService=async(route,token)=>{
    console.log(Axios);
    try {
        const result = await Axios.get(route,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            withCredentials:true
        });
        console.log(result);
    } catch (error) {
        console.log(error);
        return [];
    }
};
export const PatchService=async(route,data,token)=>{
    try {
        const result = await Axios.patch(route,data,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            withCredentials:true
        });
        console.log(result);
    } catch (error) {
        console.log(error);
    }
};