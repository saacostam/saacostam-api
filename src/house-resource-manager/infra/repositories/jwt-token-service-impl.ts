import { sign, verify } from "jsonwebtoken";
import { JwtTokenService } from "../../domain/repositories";

const SECRET = "REPLACE_ME"

export class JwtTokenServiceImpl implements JwtTokenService {
    getToken(tokenPayload: { userId: string; }): string {
        return sign(tokenPayload, SECRET, { expiresIn: 1000 * 60 * 60 });
    }

    validateToken(token: string): boolean {
        try {
            verify(token, SECRET);
            return true;
        } catch (error) {
            return false;            
        }
    }
}
