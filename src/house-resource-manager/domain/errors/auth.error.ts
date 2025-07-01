export class UserWithUsernameAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`A user with the username '${username}' already exists.`);
    this.name = 'UserWithUsernameAlreadyExistsError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
    }
  }
}

export class InvalidLoginAttemptError extends Error {
  constructor() {
    super("Invalid Login Credentials");
    this.name = 'InvalidLoginAttemptError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
    }
  }
}
