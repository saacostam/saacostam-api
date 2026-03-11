/**
 * Base interface for analytics events
 */
export interface IEvent {
	name: string;
	createdAt: Date;
	payload: string;
}
