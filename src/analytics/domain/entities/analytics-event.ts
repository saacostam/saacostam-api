/**
 * Base interface for analytics events
 */
export interface IAnalyticsEvent {
    name: string;
    createdAt: Date;
    payload: string;
}
