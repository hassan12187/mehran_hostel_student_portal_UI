import { useQuery } from "@tanstack/react-query";
import { GetService } from "../services/requestService";

const useGetQuery=(queryKey,route,token,...dependencies)=>useQuery({
    queryKey:[queryKey,dependencies],
    queryFn:()=>GetService(route,token),
    enabled:!!token,
    staleTime:60*60*1000,
    cacheTime:60*60*100
});
export default useGetQuery;