import type { NextFunction, Request, Response } from "express";
import { JwtTokenServiceImpl } from "../../infra/providers";
import { UnauthorizedError } from "../errors";

const jwtTokenService = new JwtTokenServiceImpl();

export function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthorizedError();
	}

	const token = authHeader.split(" ")[1];

	const payload = jwtTokenService.validateToken(token);

	if (payload === undefined) throw new UnauthorizedError();

	// @ts-ignore
	req.userId = payload.userId;

	next();
}
