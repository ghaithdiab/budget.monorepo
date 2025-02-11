"use server"
import { FormState, SignInFormSchema, SignupFormSchema, VerificationFormSchema, VerificationFormState } from "./type";
import axiosInstance from "@/util/axiosInstance";
import handleAxiosError from "@/util/errorHandler";
import { redirect } from "next/navigation";
import { createSession, createVerificationSession, getVerificationSession, updateSession } from "./session";








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


  await createVerificationSession({
    user : {
      id: response.data.id,
    },
    verificationToken : response.data.verificationToken,
  })

  redirect(`/auth/verification`);
  
}

export async function signIn(state: FormState,formData: FormData): Promise<FormState> {
  const validationFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) return { error: validationFields.error.flatten().fieldErrors};
  let response; 
  try{
    response = await axiosInstance.post('auth/signIn',validationFields.data,{
      headers: {
        "Content-Type": "application/json",
      } 
     })
  }catch(error){
    return {message: handleAxiosError(error)}
  }

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


export async function verifyUser(state : VerificationFormState , formData : FormData) :Promise<VerificationFormState>{
  const validationFields = VerificationFormSchema.safeParse({
    OTP : formData.get('OTP')
    })
    if (!validationFields.success) return { error :validationFields.error.flatten().fieldErrors};
    let verificationToken = await getVerificationSession();
    if(!verificationToken) return {error : {OTP : ["Invalid verification token"]}};
    let response;
    try{
      response = await axiosInstance.post('user-verification/verification',{
       verificationToken : verificationToken.verificationToken,
       OTP : formData.get('OTP'),
      })
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
} catch(error){
  return {message: handleAxiosError(error)}
}

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