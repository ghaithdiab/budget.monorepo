"use server"
import { FormState, SignupFormSchema } from "./type";
import axiosInstance from "@/util/axiosInstance";
import handleAxiosError from "@/util/errorHandler";
import { redirect } from "next/navigation";








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
  redirect(`/auth/verification?userId=${response.data.id}`);
  
}