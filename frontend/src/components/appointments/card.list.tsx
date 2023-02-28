import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Create, HighlightOff, Medication } from "@mui/icons-material";
import { PatientDTO } from "modules/patients";
import { AppointmentDTO } from "modules/appointments";

export type TPatientCardProps = {
  appointment: AppointmentDTO;
  handleMedicalAppointmentRecord: (appointment: AppointmentDTO) => void;
  handleAppointmentDeletion: (appointment: AppointmentDTO) => void;
  children: ReactNode;
};

export default function AppointmentsCard({
  appointment,
  children,
  handleMedicalAppointmentRecord,
  handleAppointmentDeletion,
}: TPatientCardProps): JSX.Element {
  const patient = appointment.patient as PatientDTO;

  const AppointmentCardContent = (patient: PatientDTO) => (
    <CardContent>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        <span style={{ fontWeight: "bold" }}>Nome:</span> {patient.name} <br />
        <span style={{ fontWeight: "bold" }}>Gênero:</span> {patient.genre}{" "}
        <br />
        <span style={{ fontWeight: "bold" }}>Data de aniversário: </span>
        {(patient.dob &&
          new Intl.DateTimeFormat("pt-BR").format(new Date(patient.dob))) ||
          "LGPD COMPLIANCE"}
        <br />
        <span style={{ fontWeight: "bold" }}>Peso: </span>
        {patient.weight}
        <br />
        <span style={{ fontWeight: "bold" }}>Altura: </span>
        {patient.height}
        <br />
      </Typography>
    </CardContent>
  );

  return (
    <div>
      <Card variant="outlined" key={appointment.id} style={{ margin: 10 }}>
        <AppointmentCardContent {...patient} />
        {children}
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
    </div>
  );
}
