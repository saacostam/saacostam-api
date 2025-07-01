export interface SignUpRequestDto {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface SignUpResponseDto {
    username: string;
}
