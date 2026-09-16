import { z } from "zod";

const usernameField = z.string().min(1).max(48);
const passwordField = z.string().min(1).max(48);

const loginValidator = z.object({
	username: usernameField,
	password: passwordField,
});

const signUpValidator = z.object({
	username: usernameField,
	password: passwordField,
});

export const AuthValidator = {
	loginValidator,
	signUpValidator,
};
