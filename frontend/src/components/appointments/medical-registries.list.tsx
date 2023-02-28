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
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { MedicalRegistriesDTO } from "modules/medical_registries";

export type TMedicalRegistriesAppointmentsListProps = {
  medicalRegistries: MedicalRegistriesDTO[];
  deleteMedicalAppointmentObservation: (registry: MedicalRegistriesDTO) => void;
};

export default function MedicalRegistriesAppointmentsList({
  medicalRegistries,
  deleteMedicalAppointmentObservation,
}: TMedicalRegistriesAppointmentsListProps): JSX.Element {
  return (
    <Box>
      <Typography variant="h6" style={{ margin: "15px 15px" }}>
        Observações do Paciente
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
              <TableCell>Observação</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalRegistries &&
              medicalRegistries.map((registry: any, i: number) => (
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
                    width={"10%"}
                  >
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
                  </TableCell>
                  <TableCell
                    component="th"
                    id={"label-obs"}
                    scope="row"
                    align="left"
                  >
                    {registry.observation}
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
                        onClick={() =>
                          deleteMedicalAppointmentObservation(registry)
                        }
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
