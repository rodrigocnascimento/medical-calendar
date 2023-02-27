import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Create, CalendarMonth, HighlightOff } from "@mui/icons-material";
import { UserRoles } from "../../modules/users";
import { PatientDTO } from "modules/patients";
import { useAuth } from "context";

export type TPatientCardProps = {
  patient: PatientDTO;
  children: ReactNode;
  createPatientAppointment: (patient: PatientDTO) => void;
  patientDeletion: (patient: PatientDTO) => void;
};

export default function PatientCard({
  patient,
  children,
  createPatientAppointment,
  patientDeletion,
}: TPatientCardProps): JSX.Element {
  const auth = useAuth();

  const PatientCardContent = (patient: PatientDTO) => (
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
  );

  return (
    <div>
      <Card variant="outlined" key={patient.id} style={{ margin: 10 }}>
        <PatientCardContent {...patient} />
        {children}
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
            onClick={() => createPatientAppointment(patient)}
          >
            <CalendarMonth />
            Agendar horário
          </Button>
          {auth.user.userRole === UserRoles.ADMIN && (
            <Button
              style={{ margin: 10 }}
              variant="contained"
              color="error"
              onClick={() => patientDeletion(patient)}
            >
              <HighlightOff />
              Excluir Paciente
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
}
