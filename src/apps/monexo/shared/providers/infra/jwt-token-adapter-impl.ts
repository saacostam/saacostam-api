import { sign, verify } from "jsonwebtoken";
import type {
	IJwtTokenAdapter,
	IJwtTokenAdapterPayload,
} from "@/apps/monexo/shared/providers/domain";
import { CoreConfig } from "@/shared/config";

const SECRET = CoreConfig.MONEXO_JWT_SECRET;

export class JwtTokenAdapterImpl implements IJwtTokenAdapter {
	getToken(tokenPayload: IJwtTokenAdapterPayload["GetTokenIn"]): string {
		return sign(tokenPayload, SECRET, { expiresIn: 1000 * 60 * 60 });
	}

	validateToken(
		token: string,
	): IJwtTokenAdapterPayload["ValidateTokenOut"] | undefined {
		try {
			return verify(
				token,
				SECRET,
			) as IJwtTokenAdapterPayload["ValidateTokenOut"];
		} catch {
			return undefined;
		}
	}
}
