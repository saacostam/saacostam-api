/**
 * Base interface for analytics events
 */
export interface IEvent {
	id: string;
	name: string;
	createdAt: Date;
	payload: string;
}
