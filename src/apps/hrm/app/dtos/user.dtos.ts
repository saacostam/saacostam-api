import type { Timezone } from "../../domain/value-objects";

export interface GetUserRequestDto {
	id: string;
}

export class MutationUpdateSettingsInDto {
	public timezone: string;
	public userId: string;
	constructor(args: {
		timezone: Timezone;
		userId: string;
	}) {
		this.timezone = args.timezone;
		this.userId = args.userId;
	}
}

export class MutationUpdateSettingOutDto {
	public ok: boolean;
	constructor(args: {
		ok: boolean;
	}) {
		this.ok = args.ok;
	}
}
