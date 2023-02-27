import React, { useState } from "react";
import { Button, Typography, Box, Modal, TextField } from "@mui/material";

import { Medication } from "@mui/icons-material";

import ErrorMessage, { TErrorMessage } from "components/error";
import { AppointmentDTO } from "../../modules/appointments/appointment.interfaces";
import {
  CreateMedicallRegistriesDTO,
  UpdateMedicallRegistriesDTO,
} from "modules/medical_registries";

export type TAppointmentObservationModalProps = {
  errorMessage?: TErrorMessage;
  open?: boolean;
  appointment?: Partial<AppointmentDTO> | undefined;
  handleMedicalRegistryCreation?: (medicalRegistry: any) => void;
  onCloseHandler?: () => void;
};

/**
 *
 * @param errorMessage Error message TErrorMessage type.
 * @param open controls wheter the modal is open or not
 * @param appointment The selected appointment
 * @param handleMedicalRegistryCreation The callback methiod to save the observation
 * @param onCloseHandler Callback method to be executed when closes the modal
 * @returns {JSX.Element} The Modal MUI React component
 */
export function AppointmentObservationModal({
  errorMessage,
  appointment,
  open = false,
  handleMedicalRegistryCreation,
  onCloseHandler,
}: TAppointmentObservationModalProps): JSX.Element {
  const [medicalRegistry, setMedicalRegistry] = useState<
    CreateMedicallRegistriesDTO | UpdateMedicallRegistriesDTO
  >({
    observation: "",
    medicalAppointment: appointment?.id || "",
  });
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onCloseHandler && onCloseHandler();
  };

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
            Observações da consulta de{" "}
            {appointment && appointment.patient?.name}
          </Typography>
          <div style={{ marginTop: 50 }}>
            <TextField
              id="outlined-multiline-static"
              label="Observações do paciente"
              name="medicalObservation"
              onChange={(e: any) =>
                setMedicalRegistry((medicalRegistry) => ({
                  ...medicalRegistry,
                  medicalAppointment: appointment?.id,
                  observation: e.target.value,
                }))
              }
              style={{ width: "100%" }}
              multiline
              rows={10}
              variant="filled"
            />
          </div>

          <div style={{ float: "right", marginTop: 30 }}>
            <Button
              variant="contained"
              style={{ marginTop: 10 }}
              onClick={() =>
                handleMedicalRegistryCreation &&
                handleMedicalRegistryCreation(medicalRegistry)
              }
            >
              <Medication />
              Confirmar observação
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
