"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import SubmitButton from '@/components/ui/submitButton';
import { toast } from '@/hooks/use-toast'
import { verifyUser } from '@/lib/auth';
import { VerificationFormSchema } from '@/lib/type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'



const VerificationForm = () => {

  const [state, action] = useActionState(verifyUser, undefined);
  const form = useForm({
    resolver: zodResolver(VerificationFormSchema),
    defaultValues: {
      OTP: "",
    },
  })

  // function onSubmit(data: z.infer<typeof VerificationFormSchema>) {
  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   })
  // }

  return (
    <div className="w-full flex flex-col justify-center items-center">
    <Form {...form}>
      <form action={action} className="w-2/3 space-y-6 text-center">
      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
          {state?.error && (
          <p className="text-sm text-red-500">{state.error.OTP}</p>
        )}
      </div>
        <FormField
          control={form.control}
          name="OTP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please enter your verification code sent to your email.</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
        <SubmitButton>Verify</SubmitButton>
      </form>
    </Form>
    </div>
  )

}

export default VerificationForm