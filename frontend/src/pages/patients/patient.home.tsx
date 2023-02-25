import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Modal,
  TextField,
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Create, PermContactCalendar, CalendarMonth, HighlightOff } from "@mui/icons-material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";

import { useAuth } from "../../context";
import { UserDTO, UserRoles, mapperDoctorListDropDown } from "../users";
import { PatientsComponentProps, PatientDTO } from "./index";
import { AppointmentDTO } from "../appointments";

import ErrorMessage, { TErrorMessage } from "../../components/error";
import SuccessMessage from "../../components/success";

import { DeleteConfirmation, TDeleteConfirmation } from "../../components/delete-confirmation";

import "./patients.css";

/**
 * This page is the dashboard of the module.
 *
 * @param {UsersComponentProps} { repository } IRepository injected repository
 * @returns {JSX.Element} Dashboard Element
 */
export function PatientsHome({ repository }: PatientsComponentProps): JSX.Element {
  const {
    appointments: appointmentRepository,
    patient: patientRepository,
    user: userRepository,
  } = repository;

  const auth = useAuth();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<TErrorMessage>();
  const [modalError, setErrorModal] = useState<TErrorMessage>();

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [doctors, setDoctors] = useState<UserDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Partial<PatientDTO>>({
    id: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<TDeleteConfirmation>();

  const [open, setOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString());
  const [appointmentDoctor, setAppointmentDoctor] = useState<{
    id: string;
    label: string;
  }>({
    id: "",
    label: "",
  });

  const handleAppointmentConfirmation = () => {
    const [date, hours] = appointmentDate.split("T");
    const [hour, minute] = hours.split(":");

    // if the userRole is "doctor", than ir should
    // assign the appointment to himself
    auth.user.userRoles === UserRoles.DOCTOR &&
      setAppointmentDoctor({
        id: auth.user.sub,
        label: auth.user.userName,
      });

    if (appointmentDoctor.id === "") {
      setErrorModal({
        title: "Erro ao fazer agendamento",
        errors: {
          Medico: ["Precisa selecionar o médico que fará a consulta."],
        },
      });
      return false;
    }

    appointmentRepository
      .create({
        patient: selectedPatient.id,
        doctor: appointmentDoctor.id,
        date: new Date(`${date}T${hour}:${minute}`),
      })
      .then(async () => {
        setSuccess("Agendamento criado com sucesso!");
        setOpen(false);
        await loadPatients();
      })
      .catch((error: Error) => {
        setOpen(false);
        setSuccess("");
        setError({
          title: error.message,
          errors: error.cause,
        });
      });
  };

  const handlePatientAppointmentModalOpen = (patient: PatientDTO) => {
    setOpen(true);
    setSelectedPatient(patient);
  };

  const handlePatientAppointmentModalClose = () => {
    setOpen(false);
    setSelectedPatient({
      id: "",
    });
  };

  const loadPatients = useCallback(async () => {
    const patients = await patientRepository.getAll();

    setPatients(patients);
  }, [patientRepository]);

  const loadDoctors = useCallback(async () => {
    userRepository
      .getAll({
        role: UserRoles.DOCTOR,
      })
      .then((doctors: UserDTO[]) => setDoctors(doctors))
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  }, [userRepository]);

  const handlePatienteDeletion = (patient: PatientDTO) => {
    patientRepository
      .remove(patient.id)
      .then(async () => {
        setSuccess("Paciente removido com sucesso.");
        await loadPatients();
      })
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  };

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, [loadPatients, loadDoctors]);

  return (
    <div className="container-home">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ margin: 10 }}>Pacientes</h1>
        <div id="new-patient" style={{ margin: 10 }}>
          <Link to={`/patients/new`}>
            <Button variant="contained" color="secondary">
              <PermContactCalendar />
              Novo
            </Button>
          </Link>
        </div>
        {success && <SuccessMessage message={success} />}
        {error && <ErrorMessage {...error} />}
        {deleteConfirmation && <DeleteConfirmation {...deleteConfirmation} />}
      </div>
      {patients &&
        patients.map((patient: PatientDTO, i: number) => {
          return (
            <Card variant="outlined" key={i++} style={{ margin: 10 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {patient.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Nome:
                  </span>{" "}
                  {patient.phone}
                  <br />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Email:
                  </span>{" "}
                  {patient.email}
                  <br />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Gênero:
                  </span>{" "}
                  {patient.genre}
                  <br />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Data de aniversário:{" "}
                  </span>
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(patient.dob))}
                  <br />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Criado em:
                  </span>{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(patient.createdAt))}
                </Typography>
                <Typography variant="h6">Agendamentos do Paciente</Typography>
                <ul>
                  {patient.appointments &&
                    patient.appointments.map((appointment: AppointmentDTO, i: number) => (
                      <li key={i++}>
                        Data/Horário:{" "}
                        {new Intl.DateTimeFormat("pt-BR", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: false,
                        }).format(new Date(appointment.date))}
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardActions>
                <Link to={`/patients/${patient.id}`}>
                  <Button style={{ margin: 10 }} variant="contained">
                    <Create />
                    Editar
                  </Button>
                </Link>

                <Button
                  style={{ margin: 10 }}
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePatientAppointmentModalOpen(patient);
                  }}
                >
                  <CalendarMonth />
                  Agendar horário
                </Button>
                {auth.user.userRole === UserRoles.ADMIN && (
                  <Button
                    style={{ margin: 10 }}
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteConfirmation({
                        message: `Confirmando essa ação, você irá excluir o registro ${patient.name}. Tem certeza disso?`,
                        onConfirmation: {
                          title: "Sim, tenho certeza.",
                          fn: () => handlePatienteDeletion(patient),
                        },
                        onFinally: () => setDeleteConfirmation(undefined),
                      });
                    }}
                  >
                    <HighlightOff />
                    Excluir Paciente
                  </Button>
                )}
              </CardActions>
            </Card>
          );
        })}
      <Modal
        open={open}
        onClose={handlePatientAppointmentModalClose}
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
          {modalError && <ErrorMessage {...modalError} />}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reserva de consulta para {selectedPatient && selectedPatient.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Confirme a data da reserva da consulta.
          </Typography>
          <div style={{ display: "block" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                views={["year", "month", "day", "hours", "minutes"]}
                label="Data do agendamento"
                value={appointmentDate}
                onChange={(newValue: any) => {
                  setAppointmentDate(new Date(newValue).toISOString());
                }}
                inputFormat="dd/MM/yyyy, hh:mm"
                renderInput={(params) => (
                  <TextField
                    style={{
                      marginLeft: 0,
                      marginTop: 25,
                      marginBottom: 30,
                    }}
                    fullWidth={true}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div style={{ display: "block", marginBottom: 30 }}>
            {auth.user.userRoles !== UserRoles.DOCTOR && (
              <Autocomplete
                disablePortal
                id="doctor"
                noOptionsText={"Médico não encontrado."}
                options={mapperDoctorListDropDown(doctors)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e: any, value: any) => setAppointmentDoctor(value)}
                renderInput={(params) => <TextField {...params} label="Selecione um Médico" />}
              />
            )}
          </div>
          <div style={{ float: "right" }}>
            <Button
              style={{ margin: 10 }}
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleAppointmentConfirmation();
              }}
            >
              <CalendarMonth />
              Confirmar agendamento
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
