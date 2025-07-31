export class CalendarDate {
	private _date: Date;

	private constructor(day: number, month: number, year: number) {
		this._date = new Date(Date.UTC(year, month - 1, day));
	}

	valueOf() {
		return this._date.getTime();
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

	public static fromISO8601(iso8601DateString: string): CalendarDate {
		const [year, month, day] = iso8601DateString.split("-").map(Number);
		if (!day || !month || !year) throw new Error("Invalid Date");
		return new CalendarDate(day, month, year);
	}
}
