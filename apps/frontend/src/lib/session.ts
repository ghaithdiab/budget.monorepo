"use server"

import { cookies} from "next/headers";
import { Session } from "./type";
import {jwtVerify, SignJWT} from "jose"
import { redirect } from "next/navigation";


const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);


export const createSession = async (payload:Session)=>{
  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await new  SignJWT(payload)
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(encodedKey);

  
  (await cookies()).set("session",session,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"lax",
    expires: expireAt,
    path:"/"
  })
}



export const getSession = async ()=>{
  try{
    const cookie = (await cookies()).get("session")?.value;
    if(!cookie) return null;
    const {payload} = await jwtVerify(cookie,encodedKey,{algorithms:["HS256"]});
    return payload as Session
  }catch(err){
    console.error(err)
    redirect('/auth/signin')
  }
  
}



export const deleteSession = async ()=>{
  (await cookies()).delete("session");
}



export const updateSession = async ({accessToken , refreshToken} : {accessToken : string , refreshToken : string})=>{
  const cookie  =  (await cookies()).get('session')?.value;
  if(!cookie) return null;
  const {payload} = await jwtVerify<Session>(cookie,encodedKey);

  if(!payload) throw new Error("Invalid session token");
  const newPayload :Session = {
    user: {
      ...payload.user
    },
    accessToken,
    refreshToken
  }

  await createSession(newPayload);
}