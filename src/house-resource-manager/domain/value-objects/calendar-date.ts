import { DateTime } from "luxon";

export type Timezone = "America/Bogota";

export class CalendarDate {
	private _date: Date;
	public readonly timezone: Timezone;

	private constructor(
		args:
			| { day: number; month: number; year: number; timezone: Timezone }
			| { date: Date; timezone: Timezone },
	) {
		if ("date" in args) {
			this._date = args.date;
			this.timezone = args.timezone;
		} else {
			const { day, month, year, timezone } = args;

			const dt = DateTime.fromObject(
				{ year, month, day, hour: 0, minute: 0, second: 0 },
				{ zone: timezone },
			);

			this._date = dt.toJSDate();
			this.timezone = timezone;
		}
	}

	public clone(): CalendarDate {
		return new CalendarDate({
			day: this._date.getUTCDate(),
			month: this._date.getUTCMonth() + 1,
			year: this._date.getUTCFullYear(),
			timezone: this.timezone,
		});
	}

	valueOf() {
		return this._date.getTime();
	}

	equals(calendarDate: CalendarDate) {
		return this.valueOf() === calendarDate.valueOf();
	}

	lessThan(calendarDate: CalendarDate): boolean {
		return this.valueOf() < calendarDate.valueOf();
	}

	lessOrEqual(calendarDate: CalendarDate): boolean {
		return this.valueOf() <= calendarDate.valueOf();
	}

	moreThan(calendarDate: CalendarDate): boolean {
		return this.valueOf() > calendarDate.valueOf();
	}

	moreOrEqual(calendarDate: CalendarDate): boolean {
		return this.valueOf() >= calendarDate.valueOf();
	}

	public getISO8601String(): string {
		const year = this._date.getUTCFullYear();
		const month = String(this._date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(this._date.getUTCDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	public getDayOfWeek(): number {
		return this._date.getUTCDay();
	}

	public getDayOfMonth(): number {
		return this._date.getUTCDate();
	}

	public getYear() {
		return this._date.getUTCFullYear();
	}

	public getMonth() {
		return this._date.getUTCMonth() + 1;
	}

	public getDay() {
		return this._date.getUTCDate();
	}

	public getWeekOfMonth(): number {
		return Math.floor((this._date.getUTCDate() - 1) / 7) + 1;
	}

	public static getDaysInMonth(year: number, month: number): number {
		return new Date(Date.UTC(year, month, 0)).getUTCDate();
	}

	public static getWeekdayOccurrences(
		year: number,
		month: number,
		weekday: number,
	): number {
		let count = 0;
		const daysInMonth = CalendarDate.getDaysInMonth(year, month);
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(Date.UTC(year, month - 1, day));
			if (date.getUTCDay() === weekday) count++;
		}
		return count;
	}

	public static fromISO8601(
		iso8601DateString: string,
		timezone: Timezone,
	): CalendarDate {
		const [year, month, day] = iso8601DateString.split("-").map(Number);
		if (!day || !month || !year) throw new Error("Invalid Date");
		return new CalendarDate({
			day,
			month,
			year,
			timezone,
		});
	}

	public static fromDate(date: Date, timezone: Timezone): CalendarDate {
		return new CalendarDate({
			date,
			timezone,
		});
	}

	public add({
		days = 0,
		weeks = 0,
		months = 0,
	}: {
		days?: number;
		weeks?: number;
		months?: number;
	}): CalendarDate {
		const newDate = new Date(this._date.getTime());

		if (months) {
			newDate.setUTCMonth(newDate.getUTCMonth() + months);
		}
		if (weeks) {
			days += weeks * 7;
		}
		if (days) {
			newDate.setUTCDate(newDate.getUTCDate() + days);
		}

		return new CalendarDate({
			day: newDate.getUTCDate(),
			month: newDate.getUTCMonth() + 1,
			year: newDate.getUTCFullYear(),
			timezone: this.timezone,
		});
	}

	public static _fromCurrentUTCDate(timezone: Timezone): CalendarDate {
		const now = DateTime.utc().setZone(timezone);
		return new CalendarDate({
			day: now.day,
			month: now.month,
			year: now.year,
			timezone,
		});
	}

	public static anchorDates(timezone: Timezone): {
		today: CalendarDate;
		tomorrow: CalendarDate;
	} {
		const today = CalendarDate._fromCurrentUTCDate(timezone);
		const tomorrow = today.add({ days: 1 });
		return { today, tomorrow };
	}
}
