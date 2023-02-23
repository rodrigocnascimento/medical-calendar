import { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./patients.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
// import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import {
  Create,
  PermContactCalendar,
  CalendarMonth,
  HighlightOff,
} from "@mui/icons-material";
import { useAuth } from "../../context/auth/use-auth";

export default function PatientsHome({ repository }: any) {
  const auth = useAuth();
  const [patientRepository, appointmentRepository] = repository;

  const [success, setSuccess] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString()
  );

  const handleAppointmentConfirmation = () => {
    console.log(appointmentDate);
    const [date, hours] = appointmentDate.split("T");
    const [hour, minute] = hours.split(":");

    appointmentRepository
      .createAppointment({
        patient: selectedPatient.id,
        doctor: auth.user.sub,
        date: `${date}T${hour}:${minute}`,
      })
      .then(async (response: any) => {
        await loadPatients();
        setSuccess("Agendamento criado com sucesso!");
        setOpen(false);
      })
      .catch((error: any) => {
        console.log("error", error);
        setOpen(false);
        setSuccess(false);
        setError(JSON.parse(error.message).message);
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

  const handlePatienteDeletion = (patient: any) => {
    if (
      window.confirm("Deseja realmente excluir o paciente: " + patient.name)
    ) {
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
  }, [loadPatients]);

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
        {success && (
          <div
            style={{
              border: "3px solid #79c288",
              borderRadius: 5,
              padding: 30,
              backgroundColor: "#a2e6b0",
            }}
          >
            {success}
          </div>
        )}
        {error && (
          <div
            style={{
              border: "3px solid red",
              borderRadius: 5,
              padding: 30,
              backgroundColor: "pink",
            }}
          >
            {error}
          </div>
        )}
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
                  <span style={{ fontWeight: "bold" }}>Nome:</span>{" "}
                  {patient.phone}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                  {patient.email}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Gênero:</span>{" "}
                  {patient.genre}
                  <br />
                  <span style={{ fontWeight: "bold" }}>
                    Data de aniversário:{" "}
                  </span>
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(patient.dob)
                  )}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Criado em:</span>{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(patient.createdAt)
                  )}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  className="patient_card__category"
                  to={`/patients/${patient.id}`}
                >
                  <Create style={{ verticalAlign: "bottom" }} />
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
                  <CalendarMonth style={{ verticalAlign: "bottom" }} />
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
                    <HighlightOff style={{ verticalAlign: "bottom" }} />
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
          <div style={{ flex: 1, display: "block" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                views={["year", "month", "day", "hours", "minutes"]}
                label="Data do agendamento"
                value={appointmentDate}
                onChange={(newValue: any) => {
                  setAppointmentDate(newValue);
                }}
                inputFormat="dd/MM/yyyy, hh:mm"
                renderInput={(params) => (
                  <TextField
                    style={{ marginLeft: 0, marginTop: 25, marginBottom: 30 }}
                    fullWidth={true}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
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
