"use server";

import axiosInstance from "@/util/axiosInstance";
import { getSession } from "./session"
import handleAxiosError from "@/util/errorHandler";
import { redirect } from "next/navigation";



export const getProfile = async () => {
  const session = await getSession();
  if(!session || !session.user){
    redirect('/auth/signin')
  }
  try{
    const response  = await axiosInstance.get('users/profile',{
      // headers: {
      //   Authorization : `Bearer ${session?.accessToken}`
      // }
    });

    console.log(response)
    return response.data;
  }catch(err){
     return {message: handleAxiosError(err)}
  }
  


}


