"use server"

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, SignupFormSchema } from "./type";








export async function signUp(state: FormState,formData: FormData): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) return { error: validationFields.error.flatten().fieldErrors};
  const response = await fetch(`${BACKEND_URL}auth/signUp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationFields.data),
    }
  )

  console.log(validationFields.data)
  if (response.ok) {
    redirect("/auth/signin");
  } else
    return {
      message:
        response.status === 409
          ? "The user is already existed!"
          : response.statusText,
    };
}