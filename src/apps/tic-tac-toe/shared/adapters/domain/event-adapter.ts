export enum IEventType {
	GAMES_CHANGED = "GAMES_CHANGED",
	USER_GAME_CHANGED = "USER_GAME_CHANGED",
	USER_GAME_REMOVED = "USER_GAME_REMOVED",
	USER_ID = "USER_ID",
}

export interface IEventAdapter {
	broadcast(event: IEventType, message?: string): Promise<void>;
	publish(id: string, event: IEventType, message?: string): Promise<void>;
}
