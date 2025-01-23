"use server"
import { FormState, SignInFormSchema, SignupFormSchema } from "./type";
import axiosInstance from "@/util/axiosInstance";
import handleAxiosError from "@/util/errorHandler";
import { redirect } from "next/navigation";
import { createSession, createVerificationSession, updateSession } from "./session";








export async function signUp(state: FormState,formData: FormData): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) return { error: validationFields.error.flatten().fieldErrors};
  let response;
  try {
    response = await axiosInstance.post('auth/signUp',validationFields.data,{
      headers: {
              "Content-Type": "application/json",
              },
    })
  }catch(err){
    return {message : handleAxiosError(err)}
  }

  console.log(response.data);

  await createVerificationSession({
    user : {
      id: response.data.id,
    },
    verificationToken : response.data.verificationToken,
  })

  redirect(`/auth/verification?userId=${response.data.id}`);
  
}

export async function signIn(state: FormState,formData: FormData): Promise<FormState> {
  const validationFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log(validationFields);
  if (!validationFields.success) return { error: validationFields.error.flatten().fieldErrors};
  let response; 
  try{
    response = await axiosInstance.post('auth/login',validationFields.data,{
      headers: {
        "Content-Type": "application/json",
      } 
     })
  }catch(error){
    return {message: handleAxiosError(error)}
  }

  console.log(response.data);
  await createSession({
    user :{
      id : response.data.id,
      name : response.data.name,
      // roles : response.data.roles,
    },
    accessToken : response.data.accessToken,
    refreshToken : response.data.refreshToken,
  });
  redirect('/dashboard');
}


export const refreshToken = async (oldRefreshToken : string)=>{
  try{
    const response = await axiosInstance.post('auth/refresh',{
      body : JSON.stringify({refresh : oldRefreshToken}),
    }    
    )
    const {accessToken, refreshToken} = response.data;

    await updateSession({accessToken, refreshToken});

    return accessToken
  }catch(e){
    return {message: handleAxiosError(e)}
  }
}