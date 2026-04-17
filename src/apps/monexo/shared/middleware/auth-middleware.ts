import type { NextFunction, Request, RequestHandler, Response } from "express";
import type {
	IJwtTokenAdapter,
	ITokenPayload,
} from "@/apps/monexo/shared/providers/domain";

interface AuthenticatedRequest extends Request {
	user: ITokenPayload;
}

type AuthHandler = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
	// biome-ignore lint/suspicious/noExplicitAny: generic type
) => any;

export const createWithAuth = (jwt: IJwtTokenAdapter) => {
	return (handler: AuthHandler): RequestHandler => {
		return (req, res, next) => {
			const authHeader = req.headers.authorization;
			const token = authHeader?.split(" ").at(1);

			if (!token) {
				return res.status(401).end();
			}

			const payload = jwt.validateToken(token);

			if (!payload) {
				return res.status(401).end();
			}

			const authReq = req as AuthenticatedRequest;
			authReq.user = payload;

			return handler(authReq, res, next);
		};
	};
};
