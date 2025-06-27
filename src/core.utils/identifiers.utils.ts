import { v4 as uuidv4 } from 'uuid';
import { Request } from "express"

export function generateId(): string {
    return uuidv4();
}

export function getIdFromRequest(req: Request) {
    if ('userId' in req && typeof req.userId === 'string' && req.userId.trim() !== '') {
        return req.userId;
    }
    return null;
}
