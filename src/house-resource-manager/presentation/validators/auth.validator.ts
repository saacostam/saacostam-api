import {z} from "zod";

const signUpValidator = z.object({  
  firstName: z.string().min(1).max(48),
  lastName: z.string().min(1).max(48),
  username: z.string().min(1).max(48),
  password: z.string().min(1).max(48),
});

export const AuthValidator = {
  signUpValidator,
}
