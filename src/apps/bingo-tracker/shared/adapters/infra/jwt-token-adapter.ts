import { sign, verify } from "jsonwebtoken";
import type {
	TokenAdapter,
	TokenAdapterPayload,
} from "@/apps/bingo-tracker/shared/adapters/domain";
import { CoreConfig } from "@/shared/config";

const SECRET = CoreConfig.BINGO_TRACKER_JWT_SECRET;

export class JwtTokenAdapter implements TokenAdapter {
	getToken(tokenPayload: TokenAdapterPayload["getToken"]["args"]): string {
		return sign(tokenPayload, SECRET, { expiresIn: 1000 * 60 * 60 });
	}

	validateToken({
		token,
	}: TokenAdapterPayload["validateToken"]["args"]):
		| TokenAdapterPayload["validateToken"]["res"]
		| undefined {
		try {
			return verify(
				token,
				SECRET,
			) as TokenAdapterPayload["validateToken"]["res"];
		} catch {
			return undefined;
		}
	}
}
