import { z } from "zod";
import { timezoneField } from "./shared.validator";

const usernameField = z.string().min(1).max(48);
const passwordField = z.string().min(1).max(48);

const signUpValidator = z.object({
	firstName: z.string().min(1).max(48),
	lastName: z.string().min(1).max(48),
	username: usernameField,
	password: passwordField,
	timezone: timezoneField,
});

const loginValidator = z.object({
	username: usernameField,
	password: passwordField,
});

export const AuthValidator = {
	loginValidator,
	signUpValidator,
};
