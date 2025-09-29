import { z } from "zod";
import { IANA_TIMEZONES } from "../../assets";
import type { Timezone } from "../../domain/value-objects";

const ianaStrings = new Set(
	IANA_TIMEZONES.flatMap((c) => c.zones.map((z) => z.name)),
);

const usernameField = z.string().min(1).max(48);
const passwordField = z.string().min(1).max(48);
const timezoneField = z
	.string()
	.refine((tz): tz is Timezone => ianaStrings.has(tz), {
		message: "Invalid IANA timezone",
	});

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
