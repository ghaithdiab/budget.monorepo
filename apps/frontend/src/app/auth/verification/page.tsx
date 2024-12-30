import React from 'react'
import VerificationForm from './verificationForm'
const verificationPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-1/4 flex flex-col justify-center items-center">
    <h1 className="text-center text-2xl font-bold mb-4">Verification code</h1>
    <VerificationForm/>
    {/* <div className="flex justify-between text-sm">
      <p>Already have an account?</p>
      <Link className="underline" href={"/auth/signin"}>
        Sign In
      </Link>
    </div> */}
  </div>
  )
}

export default verificationPage