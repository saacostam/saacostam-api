import { sign, verify } from "jsonwebtoken";
import { JwtTokenService, TokenPayload } from "../../domain/repositories";

const SECRET = "REPLACE_ME"

export class JwtTokenServiceImpl implements JwtTokenService {
    getToken(tokenPayload: TokenPayload): string {
        return sign(tokenPayload, SECRET, { expiresIn: 1000 * 60 * 60 });
    }

    validateToken(token: string): TokenPayload | undefined {
        try {
            return verify(token, SECRET) as TokenPayload;
        } catch (error) {
            return undefined;            
        }
    }
}
