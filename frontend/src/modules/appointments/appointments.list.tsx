import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PermContactCalendar } from "@mui/icons-material";

import SuccessMessage, { TSuccessMessageProps } from "components/success";
import ErrorMessage, { TErrorMessage } from "components/error";

import { AppointmentDTO } from "./index";

import {
  TDeleteConfirmation,
  DeleteConfirmation,
} from "components/delete-confirmation";
import { Button, Grid } from "@mui/material";
import "./appointments.css";
import { useRepository } from "context";
import {
  AppointmentObservationModal,
  TAppointmentObservationModalProps,
} from "components/appointments/medical-registry.modal";
import {
  CreateMedicallRegistriesDTO,
  MedicallRegistriesDTO,
  UpdateMedicallRegistriesDTO,
} from "modules/medical_registries";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import { medicalRegistriesValidation } from "modules/medical_registries/medical_registries.validation";
import { ValidationError } from "yup";
import AppointmentsCard from "components/appointments/card.list";
import MedicalRegistriesAppointmentsList from "components/appointments/medical-registries.list";

/**
 * This page is the dashboard of the module.
 *
 * @param {UsersComponentProps} { repository } IRepository injected repository
 * @returns {JSX.Element} Dashboard Element
 */
export function ListAppointments(): JSX.Element {
  const {
    appointments: appointmentRepository,
    medicalRegistries: medicalRegistriesRepository,
  } = useRepository();

  const [success, setSuccess] = useState<TSuccessMessageProps>();
  const [error, setError] = useState<TErrorMessage>();
  const [errorModal, setErrorModal] = useState<TErrorMessage>();
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<TDeleteConfirmation>();

  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);

  const loadAppointments = useCallback(async () => {
    const appointments = await appointmentRepository.getAll();

    setAppointments(appointments);
  }, [appointmentRepository]);

  const [modalState, setModalState] =
    useState<TAppointmentObservationModalProps>();

  const reset = useCallback(() => {
    setModalState(undefined);
    setSuccess(undefined);
    setError(undefined);
    setErrorModal(undefined);
    setDeleteConfirmation(undefined);
  }, []);

  const handleMedicalAppointmentRecord = useCallback(
    (appointment: AppointmentDTO) => {
      setModalState({
        open: !!appointment.id,
        appointment,
        handleMedicalRegistryCreation: (
          medicalRegistry:
            | CreateMedicallRegistriesDTO
            | UpdateMedicallRegistriesDTO
        ) => {
          medicalRegistriesValidation
            .validate(medicalRegistry, { abortEarly: false })
            .then(() =>
              medicalRegistriesRepository
                .create(medicalRegistry)
                .then(async () => {
                  setSuccess({
                    message: "Registro criado com sucesso!",
                    handlerOnClose: () => reset(),
                  });

                  await loadAppointments();
                })
                .catch((error: Error) =>
                  setErrorModal({
                    title: error.message,
                    errors: error.cause,
                  })
                )
            )
            .catch((validationErrors: ValidationError) =>
              setErrorModal({
                title: "Erro ao criar o observação.",
                errors: mapperYupErrorsToErrorMessages(validationErrors),
              })
            );
        },
        onCloseHandler: () => reset(),
      });
    },
    [medicalRegistriesRepository, loadAppointments, reset]
  );

  const handleAppointmentDeletion = useCallback(
    (appointment: AppointmentDTO) => {
      setDeleteConfirmation({
        message: `Confirmando essa ação, você irá excluir a consulta do Paciente ${appointment.patient.name}. Tem certeza disso?`,
        onConfirmation: {
          title: "Sim, tenho certeza.",
          fn: () => {
            appointmentRepository
              .remove(appointment.id)
              .then(async () => await loadAppointments())
              .catch((error: any) =>
                setError({
                  title: error.message,
                  errors: error.cause,
                })
              );
          },
        },
        onFinally: () => reset(),
      });
    },
    [appointmentRepository, loadAppointments, reset]
  );

  const deleteMedicalAppointmentObservation = (
    medicalRecord: MedicallRegistriesDTO
  ) => {
    setDeleteConfirmation({
      message: `Você irá excluir a observação da consulta. Tem certeza disso?`,
      onConfirmation: {
        title: "Sim, tenho certeza.",
        fn: () => {
          medicalRegistriesRepository
            .remove(medicalRecord.id)
            .then(async () => await loadAppointments())
            .catch((error: any) =>
              setError({
                title: error.message,
                errors: error.cause,
              })
            );
        },
      },
      onFinally: () => reset(),
    });
  };

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <div className="container-appointments">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 10 }}>Consultas</h1>
        <div id="new-appointment" style={{ margin: 10 }}>
          <Link to={`/patients/new`}>
            <Button variant="contained" color="secondary">
              <PermContactCalendar />
              Novo
            </Button>
          </Link>
        </div>
        {success && <SuccessMessage {...success} />}
        {error && <ErrorMessage {...error} />}
        {deleteConfirmation && <DeleteConfirmation {...deleteConfirmation} />}
      </div>
      {!appointments?.length && <h2>Sem consultas até o momento.</h2>}
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {appointments &&
          appointments.map((appointment: AppointmentDTO, i: number) => {
            return (
              <Grid item xs={12} key={`Grid-12-${i++}`}>
                {appointment.patient && (
                  <AppointmentsCard
                    {...{
                      appointment,
                      handleAppointmentDeletion,
                      handleMedicalAppointmentRecord,
                    }}
                  >
                    <MedicalRegistriesAppointmentsList
                      key={`medAppRegList-${i++}`}
                      medicalRegistries={appointment.medicalRegistries || []}
                      deleteMedicalAppointmentObservation={
                        deleteMedicalAppointmentObservation
                      }
                    />
                  </AppointmentsCard>
                )}
              </Grid>
            );
          })}
      </Grid>
      <AppointmentObservationModal
        {...{ ...modalState, errorMessage: errorModal }}
      />
    </div>
  );
}
