import { z } from "zod";
import { timezoneField } from "./shared.validator";

const updateSettingValidator = z.object({
	timezone: timezoneField,
});

export const UserValidator = {
	updateSettingValidator,
};
