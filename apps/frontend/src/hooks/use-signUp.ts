// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
// import useSWR from 'swr';
// import { signUp } from "@/lib/auth";
// import { UserModelDb } from '@/lib/dbTypes';
// import { SignUpError } from '@/lib/type';

// const useSignUp = () => {
//   const [formData, setFormData] = useState<{ name: string; email: string; password: string }>({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const mutate = useSWR(['signUp', formData], {
//     fetcher: async () => await signUp(formData),
//     onError: (error: SignUpError) => {
//       setError(error.message);
//     },
//     onSuccess: (data: UserModelDb) => {
//       console.log('Sign-up successful:', data);
//       window.location.href = "/auth/verification"; // Perform the redirect on success
//     }
//   }).mutate;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       await mutate();
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     formData,
//     handleChange,
//     handleSubmit,
//     error,
//     isLoading,
//   };
// };

// export default useSignUp;
