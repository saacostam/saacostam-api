import { sign, verify } from "jsonwebtoken";
import type { JwtTokenService, TokenPayload } from "@/apps/hrm/app";
import { CoreConfig } from "@/shared/core.config";

const SECRET = CoreConfig.JWT_SECRET;

export class JwtTokenServiceImpl implements JwtTokenService {
	getToken(tokenPayload: TokenPayload): string {
		return sign(tokenPayload, SECRET, { expiresIn: 1000 * 60 * 60 });
	}

	validateToken(token: string): TokenPayload | undefined {
		try {
			return verify(token, SECRET) as TokenPayload;
		} catch {
			return undefined;
		}
	}
}
