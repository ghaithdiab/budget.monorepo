"use client";
import React, { useEffect, useState } from "react";
import { ResendVerificationCode } from "@/lib/auth";

const ResendVerificationButton =  () => {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [counter, setCounter] = useState(0);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [counter]);
  const handleResend = async () => {
    setPending(true);
    setMessage("");
    await ResendVerificationCode();
    setPending(false);
    setDisabled(true);
    setCounter(30);
  };

  
  return (
        <div className="flex mt-4 text-0.9rem">
        <p>Didn't receive the code? &nbsp;</p>
        <button
          onClick={handleResend}
          className="underline text-blue-600 hover:text-blue-800 disabled:opacity-50"
          disabled={pending || disabled}
        >
          {pending ? "Resending..." : disabled ? `  wait ${counter}` :"  Resend code"}
        </button>
        {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
      </div>
  );
};

export default ResendVerificationButton;