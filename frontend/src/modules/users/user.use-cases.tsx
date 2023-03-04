import {
  CreateUserDTO,
  FilterUserDTO,
  UpdateUserDTO,
  UserDTO,
  userValidation,
} from "./index";

import { ValidationError } from "yup";

import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";

import { TErrorMessage } from "components/error";
import BaseRepository from "domain/repository";

type UserUseCaseReturn = {
  onSuccess: (user?: UserDTO | UserDTO[] | undefined) => void;
  onError: (errors: TErrorMessage) => void;
};

type LoadUserUseCaseReturn = {
  onSuccess: (user: UserDTO) => void;
  onError: (errors: TErrorMessage) => void;
};

type LoadAllUsersUseCaseReturn = {
  onSuccess: (user: UserDTO[]) => void;
  onError: (errors: TErrorMessage) => void;
};

export type TUserUseCase = {
  create(
    formInput: CreateUserDTO,
    { onSuccess, onError }: UserUseCaseReturn
  ): void;
  edit(user: UpdateUserDTO, { onSuccess, onError }: UserUseCaseReturn): void;
  remove(user: UserDTO, { onSuccess, onError }: UserUseCaseReturn): void;
  load(
    userId: UpdateUserDTO["id"],
    { onSuccess, onError }: LoadUserUseCaseReturn
  ): void;
  loadAll(
    filter: FilterUserDTO,
    { onSuccess, onError }: LoadAllUsersUseCaseReturn
  ): void;
};

export function create(
  formInput: CreateUserDTO,
  { onSuccess, onError }: UserUseCaseReturn
) {
  const { user: userRepository } = BaseRepository();
  userValidation
    .validate(formInput, {
      abortEarly: false,
    })
    .then(() =>
      userRepository
        .create(formInput)
        .then(() => onSuccess())
        .catch((error: Error) => {
          onError({
            title: error.message,
            errors: error.cause,
          });
        })
    )
    .catch((validationErrors: ValidationError) => {
      onError({
        title: "Validation errors",
        errors: mapperYupErrorsToErrorMessages(validationErrors),
      });
    });
}

export function edit(
  formInput: UpdateUserDTO,
  { onSuccess, onError }: UserUseCaseReturn
) {
  const { user: userRepository } = BaseRepository();
  userValidation
    .validate(formInput, {
      abortEarly: false,
    })
    .then(() =>
      userRepository
        .edit(formInput)
        .then(() => onSuccess())
        .catch((error: Error) => {
          onError({
            title: error.message,
            errors: error.cause,
          });
        })
    )
    .catch((validationErrors: ValidationError) => {
      onError({
        title: "Validation errors",
        errors: mapperYupErrorsToErrorMessages(validationErrors),
      });
    });
}

export function load(
  userId: string,
  { onSuccess, onError }: LoadUserUseCaseReturn
) {
  const { user: userRepository } = BaseRepository();
  userRepository
    .getById(userId)
    .then((user: UserDTO) => onSuccess(user))
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}

export function loadAll(
  filter: FilterUserDTO,
  { onSuccess, onError }: LoadAllUsersUseCaseReturn
) {
  const { user: userRepository } = BaseRepository();
  userRepository
    .getAll(filter)
    .then((user: UserDTO[]) => onSuccess(user))
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}

export function remove(
  user: UserDTO,
  { onSuccess, onError }: UserUseCaseReturn
) {
  const { user: userRepository } = BaseRepository();
  userRepository
    .remove(user.id)
    .then(() => onSuccess())
    .catch((errors: TErrorMessage) => onError(errors));
}
