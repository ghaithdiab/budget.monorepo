import z from 'zod'

export enum Role {
  ADMIN,
  USER,
  DEV
}

export type FormState =| {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;


export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long.",
    })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Contain at least one letter.",
    })
    .regex(/[0-9]/, {
      message: "Contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const SignInFormSchema = z.object({
  email : z.string().email({message: "Please enter a valid email."}).trim(),
  password: z.string().min(8, { message: "Be at least 8 characters long" }).trim()
})


export const VerificationFormSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, {
    message: "Your verification  code must be 4 numbers.",
  }),
})


// Define the expected structure of the user data
export interface UserCreated {
  id: string;
  name: string;
  email: string;
}

// Define the structure of the error response
export interface SignUpError {
  message: string;
  response?: {
    data?: {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
    };
  };
}


export type Session ={
  user : {
    id:string;
    name:string;
    // role :string;
  };
  accessToken : string;
  refreshToken : string;
}
