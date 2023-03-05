import {
  CreatePatientDTO,
  FilterPatientDTO,
  UpdatePatientDTO,
  PatientDTO,
  patientValidation,
} from "./index";

import { ValidationError } from "yup";

import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";

import BaseRepository, { IRepositories } from "domain/repository";
import { TErrorMessage } from "components/error";

type PatientUseCaseReturn = {
  onSuccess: (patient?: PatientDTO | PatientDTO[] | undefined) => void;
  onError: (errors: TErrorMessage) => void;
};

type LoadPatientUseCaseReturn = {
  onSuccess: (patient: PatientDTO) => void;
  onError: (errors: TErrorMessage) => void;
};

type LoadAllPatientsUseCaseReturn = {
  onSuccess: (patient: PatientDTO[]) => void;
  onError: (errors: TErrorMessage) => void;
};

export type TPatientUseCase = {
  create(
    formInput: CreatePatientDTO,
    { onSuccess, onError }: PatientUseCaseReturn
  ): void;
  edit(
    patient: UpdatePatientDTO,
    { onSuccess, onError }: PatientUseCaseReturn
  ): void;
  remove(
    patient: PatientDTO,
    { onSuccess, onError }: PatientUseCaseReturn
  ): void;
  load(
    patientId: UpdatePatientDTO["id"],
    { onSuccess, onError }: LoadPatientUseCaseReturn
  ): void;
  loadAll(
    filter: FilterPatientDTO,
    { onSuccess, onError }: LoadAllPatientsUseCaseReturn
  ): void;
  lgpdRemoval(
    patient: PatientDTO,
    { onSuccess, onError }: PatientUseCaseReturn
  ): void;
};

export function create(
  formInput: CreatePatientDTO,
  { onSuccess, onError }: PatientUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();

  patientValidation
    .validate(formInput, {
      abortEarly: false,
    })
    .then(() =>
      patientRepository
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
  formInput: UpdatePatientDTO,
  { onSuccess, onError }: PatientUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();
  patientValidation
    .validate(formInput, {
      abortEarly: false,
    })
    .then(() =>
      patientRepository
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
  patientId: string,
  { onSuccess, onError }: LoadPatientUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();
  patientRepository
    .getById(patientId)
    .then((patient: PatientDTO) => onSuccess(patient))
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}

export function loadAll(
  filter: FilterPatientDTO,
  { onSuccess, onError }: LoadAllPatientsUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();
  patientRepository
    .getAll(filter)
    .then((patient: PatientDTO[]) => onSuccess(patient))
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}

export function remove(
  patient: PatientDTO,
  { onSuccess, onError }: PatientUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();
  patientRepository
    .remove(patient.id)
    .then(async () => onSuccess())
    .catch((errors: TErrorMessage) => onError(errors));
}

export function lgpdRemoval(
  patient: PatientDTO,
  { onSuccess, onError }: PatientUseCaseReturn
) {
  const { patient: patientRepository }: IRepositories = BaseRepository();
  patientRepository
    .lgpdDeletion(patient.id)
    .then(() => onSuccess())
    .catch((error: Error) =>
      onError({
        title: error.message,
        errors: error.cause,
      })
    );
}
