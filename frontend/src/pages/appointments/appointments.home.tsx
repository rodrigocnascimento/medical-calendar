import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Create, HighlightOff, PermContactCalendar } from "@mui/icons-material";
import MedicationIcon from "@mui/icons-material/Medication";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import SuccessMessage, { TSuccessMessageProps } from "components/success";
import ErrorMessage, { TErrorMessage } from "components/error";

import { AppointmentDTO } from "./index";
import {
  CreateMedicallRegistriesDTO,
  UpdateMedicallRegistriesDTO,
} from "pages/medical_registries";
import {
  TDeleteConfirmation,
  DeleteConfirmation,
} from "components/delete-confirmation";
import { Button } from "@mui/material";
import "./appointments.css";
import { useRepository } from "context";

/**
 * This page is the dashboard of the module.
 *
 * @param {UsersComponentProps} { repository } IRepository injected repository
 * @returns {JSX.Element} Dashboard Element
 */
export function AppointmentsHome(): JSX.Element {
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

  const [open, setOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<
    Partial<AppointmentDTO>
  >({
    id: "",
    patient: "",
  });

  const [medicalRegistry, setMedicalRegistry] = useState<
    CreateMedicallRegistriesDTO | UpdateMedicallRegistriesDTO
  >({
    id: "",
    observation: "",
    medicalAppointment: "",
  });

  const reset = () => {
    setError(undefined);
    setErrorModal(undefined);
    setSuccess(undefined);
    setOpen(false);
    setMedicalRegistry({
      observation: "",
      medicalAppointment: "",
    });
    setSelectedAppointment({
      id: "",
      patient: "",
    });
    setAppointments([]);
  };

  const loadAppointments = useCallback(async () => {
    const appointments = await appointmentRepository.getAll();

    setAppointments(appointments);
  }, [appointmentRepository]);

  const handleMedicalRegistryCreation = () => {
    if (medicalRegistry.id === "") {
      setErrorModal({
        title: "Erro ao adicionar observação",
        errors: {
          "Observação Médica": ["Precisa informar uma observação!"],
        },
      });
      setOpen(false);
      return;
    }

    medicalRegistriesRepository
      .create({
        observation: medicalRegistry,
        medicalAppointment: selectedAppointment.id,
      })
      .then(async () => {
        setSuccess({
          message: "Registro criado com sucesso!",
          handlerOnClose: () => reset(),
        });

        await loadAppointments();
      })
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  };

  const handleAppointmentDeletion = (appointment: any) => {
    appointmentRepository
      .remove(appointment.id)
      .then(async () => await loadAppointments())
      .catch((error: any) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
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
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                    setSelectedAppointment(appointment);
                  }}
                >
                  <MedicationIcon />
                  Observação
                </Button>
                <Button
                  style={{ margin: 10 }}
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteConfirmation({
                      message: `Confirmando essa ação, você irá excluir a consulta do Paciente ${appointment.patient.name}. Tem certeza disso?`,
                      onConfirmation: {
                        title: "Sim, tenho certeza.",
                        fn: () => handleAppointmentDeletion(appointment),
                      },
                      onFinally: () => setDeleteConfirmation(undefined),
                    });
                  }}
                >
                  <HighlightOff />
                  Excluir Consulta
                </Button>
              </CardActions>
            </Card>
          );
        })}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex-row"
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {errorModal && <ErrorMessage {...errorModal} />}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Observações da consulta de{" "}
            {selectedAppointment && selectedAppointment.patient?.name}
          </Typography>
          <div style={{ marginTop: 50 }}>
            <TextField
              id="outlined-multiline-static"
              label="Observações do paciente"
              name="medicalObservation"
              onChange={(e: any) => setMedicalRegistry(e.target.value)}
              style={{ width: "100%" }}
              multiline
              rows={10}
              variant="filled"
            />
          </div>

          <div style={{ float: "right", marginTop: 30 }}>
            <Button
              variant="contained"
              style={{ marginTop: 10 }}
              onClick={(e) => {
                e.preventDefault();
                handleMedicalRegistryCreation();
              }}
            >
              <MedicationIcon />
              Confirmar observação
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
