import Axios from "../components/Reusable/Axios";

export const GetService=async(route,token)=>{
    try {
        const result = await Axios.get(route,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            withCredentials:true
        });
        console.log(result);
        if(result.status==200)return result.data;
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
export const PostService=async(route,data,token)=>{
    try {
        const result = await Axios.post(route,data,{
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