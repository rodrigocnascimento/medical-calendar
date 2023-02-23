import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./patients.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Create,
  PermContactCalendar,
  CalendarMonth,
  HighlightOff,
} from "@mui/icons-material";
import { useAuth } from "../../context/auth/use-auth";

export default function PatientsHome({ repository: patientRepository }: any) {
  const auth = useAuth();

  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [open, setOpen] = useState(false);

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
            Faça uma reserva para {selectedPatient && selectedPatient.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
