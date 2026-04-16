export interface IJwtTokenAdapter {
	getToken(tokenPayload: IJwtTokenAdapterPayload["GetTokenIn"]): string;
	validateToken(
		token: string,
	): IJwtTokenAdapterPayload["ValidateTokenOut"] | undefined;
}

export interface ITokenPayload {
	userId: string;
}

export interface IJwtTokenAdapterPayload {
	GetTokenIn: ITokenPayload;
	ValidateTokenOut: ITokenPayload;
}
