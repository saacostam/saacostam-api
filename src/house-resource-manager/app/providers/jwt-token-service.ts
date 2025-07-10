export interface TokenPayload {
	userId: string;
}

export interface JwtTokenService {
	getToken(tokenPayload: TokenPayload): string;
	validateToken(token: string): TokenPayload | undefined;
}
