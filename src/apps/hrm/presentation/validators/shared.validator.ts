import { z } from "zod";
import { IANA_TIMEZONES } from "../../assets";
import type { Timezone } from "../../domain/value-objects";

const ianaStrings = new Set(
	IANA_TIMEZONES.flatMap((c) => c.zones.map((z) => z.name)),
);
export const timezoneField = z
	.string()
	.refine((tz): tz is Timezone => ianaStrings.has(tz), {
		message: "Invalid IANA timezone",
	});
