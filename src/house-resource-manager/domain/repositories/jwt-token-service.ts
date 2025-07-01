export interface JwtTokenService {
    getToken(tokenPayload: {
        userId: string,
    }): string,
    validateToken(token: string): boolean;
}
