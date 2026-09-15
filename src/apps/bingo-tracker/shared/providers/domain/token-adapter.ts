export interface TokenAdapter {
	getToken(args: TokenAdapterPayload["getToken"]["args"]): string;
	validateToken(
		args: TokenAdapterPayload["validateToken"]["args"],
	): TokenAdapterPayload["validateToken"]["res"] | undefined;
}

export interface TokenPayload {
	userId: string;
}

export interface TokenAdapterPayload {
	getToken: {
		args: TokenPayload;
	};
	validateToken: {
		args: {
			token: string;
		};
		res: TokenPayload;
	};
}
