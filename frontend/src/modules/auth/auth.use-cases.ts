import BaseRepository, { IRepositories } from "domain/repository";
import { TErrorMessage } from "components/error";

import { AuthCredentials, JWTAccessToken } from "./index";

type AuthUseCasesCaseReturn = {
  onSuccess: (accessToken: JWTAccessToken) => void;
  onError?: (errors: TErrorMessage) => void;
};

export type TAuthUseCases = {
  login(
    { username, password }: AuthCredentials,
    { onSuccess, onError }: AuthUseCasesCaseReturn
  ): void;
};

export function login(
  { username, password }: AuthCredentials,
  { onSuccess, onError }: AuthUseCasesCaseReturn
) {
  const { auth: authRepository }: IRepositories = BaseRepository();

  authRepository
    .checkCredentials({
      username,
      password,
    })
    .then((accessToken: JWTAccessToken) => onSuccess(accessToken))
    .catch(
      (error: Error) =>
        onError &&
        onError({
          title: error.message,
          errors: error.cause,
        })
    );
}
