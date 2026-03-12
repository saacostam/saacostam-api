import { IANA_TIMEZONES } from "@/apps/hrm/assets";
import { QueryGetTimezonesOutDto } from "../dtos";

export class TimezoneUseCasesService {
	async getTimezones(): Promise<QueryGetTimezonesOutDto> {
		return new QueryGetTimezonesOutDto(IANA_TIMEZONES);
	}
}
