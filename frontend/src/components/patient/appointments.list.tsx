import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppointmentDTO } from "modules/appointments";
import EditIcon from "@mui/icons-material/Edit";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export type TPatientAppointmentsListProps = {
  appointments: AppointmentDTO[];
  deletePatientAppointment: (appointment: AppointmentDTO) => void;
};

export default function PatientAppointmentsList({
  appointments,
  deletePatientAppointment,
}: TPatientAppointmentsListProps): JSX.Element {
  return (
    <Box>
      <Typography variant="h6" style={{ margin: "15px 15px" }}>
        Agendamentos do Paciente
      </Typography>
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          position: "relative",
          display: "block",
          maxWidth: "100%",
          "& td, & th": { whiteSpace: "nowrap" },
        }}
        style={{ overflow: "scroll", height: 200 }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell>Data/Horário</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments &&
              appointments.map((appointment: AppointmentDTO, i: number) => (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  tabIndex={-1}
                  key={i++}
                >
                  <TableCell
                    component="th"
                    id={"label"}
                    scope="row"
                    align="left"
                  >
                    {new Intl.DateTimeFormat("pt-BR", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: false,
                    }).format(new Date(appointment.date))}
                  </TableCell>
                  <TableCell
                    component="th"
                    id={"label-actions"}
                    scope="row"
                    align="right"
                  >
                    <Tooltip title="Excluir Agendamento">
                      <IconButton
                        size="medium"
                        style={{ margin: 5 }}
                        aria-label="close"
                        color="inherit"
                        onClick={() => deletePatientAppointment(appointment)}
                      >
                        <EventBusyIcon color="error" fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
