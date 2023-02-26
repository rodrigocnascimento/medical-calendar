import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import {
  Create,
  HighlightOff,
  Medication,
  PermContactCalendar,
} from "@mui/icons-material";

import SuccessMessage, { TSuccessMessageProps } from "components/success";
import ErrorMessage, { TErrorMessage } from "components/error";

import { AppointmentDTO } from "./index";

import {
  TDeleteConfirmation,
  DeleteConfirmation,
} from "components/delete-confirmation";
import { Button } from "@mui/material";
import "./appointments.css";
import { useRepository } from "context";
import {
  AppointmentObservationModal,
  TAppointmentObservationModalProps,
} from "./appointment-obs.modal";
import {
  CreateMedicallRegistriesDTO,
  UpdateMedicallRegistriesDTO,
} from "modules/medical_registries";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import { medicalRegistriesValidation } from "modules/medical_registries/medical_registries.validation";
import { ValidationError } from "yup";

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
          fn: () => (appointment: any) => {
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
      {appointments &&
        appointments.map((appointment: AppointmentDTO, i: number) => {
          if (!appointment.patient) {
            appointment.patient = {
              name: "LGPD COMPLIANCE",
              genre: "LGPD COMPLIANCE",
              weight: "LGPD COMPLIANCE",
              height: "LGPD COMPLIANCE",
            };
          }
          return (
            <Card variant="outlined" key={i++} style={{ margin: 10 }}>
              <CardContent>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                  {appointment.patient.name} <br />
                  <span style={{ fontWeight: "bold" }}>Gênero:</span>{" "}
                  {appointment.patient.genre} <br />
                  <span style={{ fontWeight: "bold" }}>
                    Data de aniversário:{" "}
                  </span>
                  {(appointment.patient.dob &&
                    new Intl.DateTimeFormat("pt-BR").format(
                      new Date(appointment.patient.dob)
                    )) ||
                    "LGPD COMPLIANCE"}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Peso: </span>
                  {appointment.patient.weight}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Altura: </span>
                  {appointment.patient.height}
                  <br />
                </Typography>
                <Typography variant="h6" component="div">
                  Observações da consulta
                </Typography>
                <ul
                  style={{
                    margin: "0px 0px 20px 0px",
                    listStyle: "none",
                    overflow: "scroll",
                    padding: "20px 10px 20px 10px",
                    backgroundColor: "f1f1f1",
                    maxHeight: 150,
                  }}
                >
                  {appointment.medicalRegistries &&
                    appointment.medicalRegistries.map(
                      (registry: any, i: number) => (
                        <li style={{ marginBottom: 40 }} key={i++}>
                          Data:{" "}
                          {registry.createdAt &&
                            new Intl.DateTimeFormat("pt-BR", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: false,
                            }).format(new Date(registry.createdAt))}
                          <br />
                          {registry.observation}
                        </li>
                      )
                    )}
                </ul>
              </CardContent>
              <CardActions>
                <Link to={`/patients/`}>
                  <Button variant="contained" style={{ margin: 10 }}>
                    <Create />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  style={{ margin: 10 }}
                  onClick={() => handleMedicalAppointmentRecord(appointment)}
                >
                  <Medication />
                  Observação
                </Button>
                <Button
                  style={{ margin: 10 }}
                  variant="contained"
                  color="error"
                  onClick={() => handleAppointmentDeletion(appointment)}
                >
                  <HighlightOff />
                  Excluir Consulta
                </Button>
              </CardActions>
            </Card>
          );
        })}

      <AppointmentObservationModal
        {...{ ...modalState, errorMessage: errorModal }}
      />
    </div>
  );
}
