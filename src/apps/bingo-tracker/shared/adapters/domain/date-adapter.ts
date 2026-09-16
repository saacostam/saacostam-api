export interface DateAdapter {
	/**
	 * Provides the current time as a Unix timestamp in milliseconds.
	 */
	now(): number;
}
