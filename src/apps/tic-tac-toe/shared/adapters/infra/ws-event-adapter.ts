import type { WebSocket } from "ws";
import type {
	IEventAdapter,
	IEventType,
} from "@/apps/tic-tac-toe/shared/adapters/domain";

export class WsEventAdapter implements IEventAdapter {
	private conns: Map<string, WebSocket> = new Map();

	addConnection(userId: string, conn: WebSocket) {
		return this.conns.set(userId, conn);
	}

	removeConnection(userId: string) {
		if (this.conns.has(userId)) {
			this.conns.delete(userId);
		}
	}

	async broadcast(event: IEventType, message?: string): Promise<void> {
		for (const [_, conn] of this.conns) {
			this._send(conn, event, message);
		}
	}

	async publish(
		id: string,
		event: IEventType,
		message?: string,
	): Promise<void> {
		const conn = this.conns.get(id);

		if (!conn) return;

		this._send(conn, event, message);
	}

	async _send(
		conn: WebSocket,
		event: IEventType,
		message?: string,
	): Promise<void> {
		const payload = {
			event,
			message: message,
		};

		conn.send(JSON.stringify(payload));
	}
}
