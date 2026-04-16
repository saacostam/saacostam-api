import { z } from "zod";

const usernameField = z.string().min(1).max(48);
const passwordField = z.string().min(1).max(48);

const signUpValidator = z.object({
	username: usernameField,
	password: passwordField,
});

export const AuthValidator = {
	signUpValidator,
};
