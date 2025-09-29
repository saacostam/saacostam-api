import { IANA_TIMEZONES } from "../../assets";
import { QueryGetTimezonesOutDto } from "../dtos";

export class TimezoneUseCasesService {
	async getTimezones(): Promise<QueryGetTimezonesOutDto> {
		return new QueryGetTimezonesOutDto(IANA_TIMEZONES);
	}
}
