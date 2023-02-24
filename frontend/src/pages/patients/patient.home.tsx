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
} from "@mui/material";
import { Create, PermContactCalendar, CalendarMonth, HighlightOff } from "@mui/icons-material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";

import { useAuth } from "../../context/auth/use-auth";
import { mapperDoctorListDropDown } from "../users/user.mapper";
import { DoctorUserDTO, UserRoles } from "../users/user.dto";
import { PatientDTO } from "./patient.interfaces";

import ErrorMessage, { TErrorMessage } from "../../components/error";
import SuccessMessage from "../../components/success";
import type { PatientsHomeProps } from "./patient.interfaces";

import "./patients.css";

export default function PatientsHome({ repository }: PatientsHomeProps) {
  const {
    appointments: appointmentRepository,
    patient: patientRepository,
    user: userRepository,
  } = repository;

  const auth = useAuth();

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<TErrorMessage>();

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorUserDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString());
  const [appointmentDoc, setAppointmentDoc] = useState<any>();

  const handleAppointmentConfirmation = () => {
    const [date, hours] = appointmentDate.split("T");
    const [hour, minute] = hours.split(":");

    appointmentRepository
      .createAppointment({
        patient: selectedPatient.id,
        doctor: appointmentDoc.id,
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

  const handleOpen = (patient: any) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setOpen(false);
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
      .then((doctors: any) => setDoctors(doctors))
      .catch((error: any) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  }, [userRepository]);

  const handlePatienteDeletion = (patient: any) => {
    if (window.confirm("Deseja realmente excluir o paciente: " + patient.name)) {
      patientRepository
        .removePatient(patient.id)
        .then(async (response: any) => {
          await loadPatients();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, [loadPatients, loadDoctors]);

  return (
    <div className="container-home">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 20 }}>Pacientes</h1>
        <div id="new-patient" style={{ margin: 20 }}>
          <Link className="patient_card__new" to={`/patients/new`}>
            <PermContactCalendar style={{ verticalAlign: "bottom" }} />
            Novo
          </Link>
        </div>
        {success && <SuccessMessage message={success} />}
        {error && <ErrorMessage title={error.title} errors={error.errors} />}
      </div>
      {patients &&
        patients.map((patient, i) => {
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
              </CardContent>
              <CardActions>
                <Link className="patient_card__category" to={`/patients/${patient.id}`}>
                  <Create
                    style={{
                      verticalAlign: "bottom",
                    }}
                  />
                  Editar
                </Link>

                <a
                  href="dangerouslySetInnerHTML"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpen(patient);
                  }}
                  className="patient_card__category"
                >
                  <CalendarMonth
                    style={{
                      verticalAlign: "bottom",
                    }}
                  />
                  Agendar horário
                </a>
                {auth.user.userRole === "admin" && (
                  <a
                    href="dangerouslySetInnerHTML"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePatienteDeletion(patient);
                    }}
                    className="patient_card__category danger"
                  >
                    <HighlightOff
                      style={{
                        verticalAlign: "bottom",
                      }}
                    />
                    Excluir Paciente
                  </a>
                )}
              </CardActions>
            </Card>
          );
        })}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
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
            <Autocomplete
              disablePortal
              id="doctor"
              noOptionsText={"Nenhum Médico encontrado."}
              options={mapperDoctorListDropDown(doctors)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e: any, value: any) => setAppointmentDoc(value)}
              renderInput={(params) => <TextField {...params} label="Selecione um Médico" />}
            />
          </div>
          <div style={{ float: "right" }}>
            <a
              href="dangerouslySetInnerHTML"
              onClick={(e) => {
                e.preventDefault();
                handleAppointmentConfirmation();
              }}
              className="patient_card__category"
            >
              <CalendarMonth style={{ verticalAlign: "bottom" }} />
              Confirmar agendamento
            </a>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
