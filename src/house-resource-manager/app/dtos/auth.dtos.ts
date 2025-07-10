export interface SignUpRequestDto {
	username: {
		fieldName: string;
		value: string;
	};
	firstName: {
		fieldName: string;
		value: string;
	};
	lastName: {
		fieldName: string;
		value: string;
	};
	password: {
		fieldName: string;
		value: string;
	};
}

export interface SignUpResponseDto {
	username: string;
}

export interface LoginRequestDto {
	username: string;
	password: string;
}

export interface LoginResponseDto {
	token: string;
}
