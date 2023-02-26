import React, { useState } from "react";

import {
  Box,
  Modal,
  TextField,
  Autocomplete,
  Typography,
  Button,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { DoctorMUIDropDownListDTO, UserRoles } from "../users";

import ErrorMessage, { TErrorMessage } from "components/error";

import { CalendarMonth } from "@mui/icons-material";
import { PatientDTO } from "./patient.interfaces";
import { useAuth } from "context";

export type TPatientAppointmentModalProps = {
  errorMessage?: TErrorMessage;
  open?: boolean;
  doctorDropDownList?: DoctorMUIDropDownListDTO[];
  patient?: Partial<PatientDTO> | undefined;
  handleAppointmentCreation?: (
    appointmentDoctor: DoctorMUIDropDownListDTO,
    appointmentDate: string
  ) => void;
  onCloseHandler?: () => void;
};

/**
 * PatientAppointmentModal Modal of patient appointments
 * @type TPatientAppointmentModalProps
 * @param errorMessage Error message TErrorMessage type.
 * @param {boolean} open controls wheter the modal is open or not
 * @param {DoctorMUIDropDownListDTO[]} doctorDropDownList The selected appointment
 * @param {Partial<PatientDTO> | undefined} patient The callback methiod to save the observation
 * @param handleAppointmentCreation  Callback method to be executed on modal, this callback receives two params: {appointmentDoctor: DoctorMUIDropDownListDTO; appointmentDate: string;}
 * @param {void} onCloseHandler Callback method to be executed when closes the modal
 * @returns {JSX.Element} The Modal MUI React component
 */
export function PatientAppointmentModal({
  errorMessage,
  doctorDropDownList,
  open = false,
  patient,
  handleAppointmentCreation,
  onCloseHandler,
}: TPatientAppointmentModalProps): JSX.Element {
  const auth = useAuth();

  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString()
  );

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAppointmentDoctor({
      id: "",
      label: "",
    });
    onCloseHandler && onCloseHandler();
  };

  const [appointmentDoctor, setAppointmentDoctor] = useState<{
    id: string;
    label: string;
  }>({
    id: "",
    label: "",
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
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
          {errorMessage && <ErrorMessage {...errorMessage} />}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reserva de consulta para {patient && patient.name}
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
                onChange={(newValue: any) => setAppointmentDate(newValue)}
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
            {auth.user.userRole !== UserRoles.DOCTOR && (
              <Autocomplete
                disablePortal
                id="doctor"
                noOptionsText={"Médico não encontrado."}
                options={doctorDropDownList || []}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e: any, value: any) => setAppointmentDoctor(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Selecione um Médico" />
                )}
              />
            )}
          </div>
          <div style={{ float: "right" }}>
            <Button
              style={{ margin: 10 }}
              variant="contained"
              onClick={() =>
                handleAppointmentCreation &&
                handleAppointmentCreation(appointmentDoctor, appointmentDate)
              }
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
