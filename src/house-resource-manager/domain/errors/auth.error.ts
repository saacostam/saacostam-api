export class UserWithUsernameAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`A user with the username '${username}' already exists.`);
    this.name = 'UserWithUsernameAlreadyExistsError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
    }
  }
}
