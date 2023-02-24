import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Create, HighlightOff } from "@mui/icons-material";
import MedicationIcon from "@mui/icons-material/Medication";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import "./appointments.css";
import SuccessMessage from "../../components/success";
import ErrorMessage from "../../components/error";

export default function AppointmentsHome({ repository }: any) {
  const [appointmentRepository, medicalRegistriesRepository] = repository;

  const [success, setSuccess] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<any>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [medicalRegistry, setMedicalRegistry] = useState<any>("");

  const loadAppointments = useCallback(async () => {
    const appointments = await appointmentRepository.getAll();

    setAppointments(appointments);
  }, [appointmentRepository]);

  const handleMedicalRegistryCreation = () => {
    if (medicalRegistry === "") {
      setErrorMessages([
        {
          "Observação Médica": ["Precisa informar uma observação!"],
        },
      ]);
      setOpen(false);
      return;
    }

    medicalRegistriesRepository
      .createMedicalRegistry({
        observation: medicalRegistry,
        medicalAppointment: selectedAppointment.id,
      })
      .then(async (response: any) => {
        setSuccess("Registro criado com sucesso!");
        setOpen(false);
        setMedicalRegistry("");
        await loadAppointments();
      })
      .catch((error: any) => {
        console.log("error", error);
        setOpen(false);
        setErrorMessages(error.message.message);
      });
  };

  const handleAppointmentDeletion = (appointment: any) => {
    if (window.confirm("Deseja realmente excluir a consulta? ")) {
      appointmentRepository
        .removeAppointment(appointment.id)
        .then(async (response: any) => {
          await loadAppointments();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <div className="container-appointments">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 20 }}>Consultas</h1>
        {success && <SuccessMessage message={success} />}
        {errorMessages && <ErrorMessage title="Erro!" errors={errorMessages} />}
      </div>
      {!appointments?.length && <h2>Sem consultas até o momento.</h2>}
      {appointments &&
        appointments.map((appointment, i) => {
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
                  <span style={{ fontWeight: "bold" }}>Nome:</span> {appointment.patient.name}{" "}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Gênero:</span> {appointment.patient.genre}{" "}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Data de aniversário: </span>
                  {(appointment.patient.dob &&
                    new Intl.DateTimeFormat("pt-BR").format(new Date(appointment.patient.dob))) ||
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
                    appointment.medicalRegistries.map((registry: any, i: number) => (
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
                    ))}
                </ul>
              </CardContent>
              <CardActions>
                <Link className="patient_card__category" to={`/patients/`}>
                  <Create style={{ verticalAlign: "bottom" }} />
                  Editar
                </Link>
                <a
                  href="dangerouslySetInnerHTML"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                    setSelectedAppointment(appointment);
                  }}
                  className="patient_card__category"
                >
                  <MedicationIcon style={{ verticalAlign: "bottom" }} />
                  Observação
                </a>
                <a
                  href="dangerouslySetInnerHTML"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAppointmentDeletion(appointment);
                  }}
                  className="patient_card__category danger"
                >
                  <HighlightOff style={{ verticalAlign: "bottom" }} />
                  Excluir Consulta
                </a>
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
            Observações da consulta de {selectedAppointment && selectedAppointment.patient.name}
          </Typography>
          <div style={{ flex: 1, display: "block", marginTop: 50 }}>
            <TextField
              id="outlined-multiline-static"
              label="Observações do paciente"
              name="medicalObservation"
              onChange={(e: any) => setMedicalRegistry(e.target.value)}
              multiline
              rows={10}
              variant="outlined"
            />
          </div>

          <div style={{ float: "right", marginTop: 30 }}>
            <a
              href="dangerouslySetInnerHTML"
              onClick={(e) => {
                e.preventDefault();
                handleMedicalRegistryCreation();
              }}
              className="patient_card__category"
            >
              <MedicationIcon style={{ verticalAlign: "bottom" }} />
              Confirmar observação
            </a>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
