export interface SignUpRequestDto {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
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
