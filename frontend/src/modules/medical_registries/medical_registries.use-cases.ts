import { ValidationError } from "yup";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";

import BaseRepository, { IRepositories } from "domain/repository";
import { TErrorMessage } from "components/error";

import {
  CreateMedicalRegistriesDTO,
  MedicalRegistriesDTO,
  UpdateMedicalRegistriesDTO,
  medicalRegistriesValidation,
} from "./index";

type MedicalRegistriesUseCaseReturn = {
  onSuccess: (
    medicalRegistries?:
      | MedicalRegistriesDTO
      | MedicalRegistriesDTO[]
      | undefined
  ) => void;
  onError: (errors: TErrorMessage) => void;
};

export type TMedicalRegistriesUseCases = {
  create(
    medicalRegistry: CreateMedicalRegistriesDTO | UpdateMedicalRegistriesDTO,
    { onSuccess, onError }: MedicalRegistriesUseCaseReturn
  ): void;
  remove(
    medicalRegistry: MedicalRegistriesDTO,
    { onSuccess, onError }: MedicalRegistriesUseCaseReturn
  ): void;
};

export function create(
  medicalRegistry: CreateMedicalRegistriesDTO | UpdateMedicalRegistriesDTO,
  { onSuccess, onError }: MedicalRegistriesUseCaseReturn
) {
  const { medicalRegistries: medicalRegistriesRepository }: IRepositories =
    BaseRepository();

  medicalRegistriesValidation
    .validate(medicalRegistry, { abortEarly: false })
    .then(() =>
      medicalRegistriesRepository
        .create(medicalRegistry)
        .then(() => onSuccess())
        .catch((errors: Error) =>
          onError({
            title: errors.message,
            errors: errors.cause,
          })
        )
    )
    .catch((validationErrors: ValidationError) =>
      onError({
        title: "Erro ao criar o observação.",
        errors: mapperYupErrorsToErrorMessages(validationErrors),
      })
    );
}

export function remove(
  medicalRegistry: MedicalRegistriesDTO,
  { onSuccess, onError }: MedicalRegistriesUseCaseReturn
) {
  const { medicalRegistries: medicalRegistriesRepository }: IRepositories =
    BaseRepository();

  medicalRegistriesRepository
    .remove(medicalRegistry.id)
    .then(() => onSuccess())
    .catch((error: any) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}
