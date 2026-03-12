import { sign, verify } from "jsonwebtoken";
import { CoreConfig } from "../../../../shared/core.config";
import type { JwtTokenService, TokenPayload } from "../../app/providers";

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
