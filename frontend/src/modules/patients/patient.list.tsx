import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import { PermContactCalendar } from "@mui/icons-material";

import { useAuth, useRepository } from "context";
import {
  DoctorMUIDropDownListDTO,
  UserDTO,
  UserRoles,
  mapDoctorDropDownList,
} from "../users";
import { PatientDTO } from "./index";

import ErrorMessage, { TErrorMessage } from "components/error";
import SuccessMessage, { TSuccessMessageProps } from "components/success";

import {
  DeleteConfirmation,
  TDeleteConfirmation,
} from "components/delete-confirmation";

import "./patients.css";
import {
  PatientAppointmentModal,
  TPatientAppointmentModalProps,
} from "components/patient/appointment.modal";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import { appointmentCreationValidation } from "modules/appointments/appointments.validation";
import { ValidationError } from "yup";
import PatientCard from "components/patient/card.list";
import PatientAppointmentsList from "components/patient/appointments.list";
import { AppointmentDTO } from "modules/appointments";

/**
 * This page is the dashboard of the module.
 *
 * @param {UsersComponentProps} { repository } IRepository injected repository
 * @returns {JSX.Element} Dashboard Element
 */
export function ListPatients(): JSX.Element {
  const {
    appointments: appointmentRepository,
    patient: patientRepository,
    user: userRepository,
  } = useRepository();

  const auth = useAuth();
  const [success, setSuccess] = useState<TSuccessMessageProps>();
  const [error, setError] = useState<TErrorMessage>();
  const [errorModal, setErrorModal] = useState<TErrorMessage>();
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<TDeleteConfirmation>();

  const [modalState, setModalState] = useState<TPatientAppointmentModalProps>();

  const [patients, setPatients] = useState<PatientDTO[]>([]);

  const [doctorDropDownList, setDoctorDropDownList] = useState<
    DoctorMUIDropDownListDTO[]
  >([]);

  const reset = () => {
    setError(undefined);
    setErrorModal(undefined);
    setSuccess(undefined);
    setDeleteConfirmation(undefined);
    setModalState(undefined);
  };

  const loadPatients = useCallback(async () => {
    const patients = await patientRepository.getAll();

    setPatients(patients);
  }, [patientRepository]);

  const createPatientAppointment = useCallback(
    (patient: Partial<PatientDTO>) => {
      setModalState({
        open: !!patient.id,
        patient,
        handleAppointmentCreation: (appointmentDoctor, appointmentDate) => {
          const [date, fullhour] = new Date(appointmentDate)
            .toISOString()
            .split("T");
          const [hour, minute] = fullhour.split(":");

          const createAppointment = {
            patient: patient.id,
            doctor: appointmentDoctor.id,
            date: new Date(`${date}T${hour}:${minute}`),
          };

          // if the userRole is "doctor", than ir should
          // assign the appointment to himself
          if (auth.user.userRole === UserRoles.DOCTOR) {
            createAppointment.doctor = auth.user.sub;
          }

          appointmentCreationValidation
            .validate(createAppointment, { abortEarly: false })
            .then(() =>
              appointmentRepository
                .create(createAppointment)
                .then(async () => {
                  setSuccess({
                    message: "Agendamento criado com sucesso!",
                    handlerOnClose: () => reset(),
                  });
                  await loadPatients();
                })
                .catch((error: Error) => {
                  setErrorModal({
                    title: "",
                    errors: error.cause,
                  });
                })
            )
            .catch((validationErrors: ValidationError) =>
              setErrorModal({
                title: "Erro ao criar o agendamento.",
                errors: mapperYupErrorsToErrorMessages(validationErrors),
              })
            );
        },
        onCloseHandler: () => reset(),
      });
    },
    [appointmentRepository, auth, loadPatients]
  );

  const deletePatientAppointment = (appointment: AppointmentDTO) => {
    const formatedDate = new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format(new Date(appointment.date));

    setDeleteConfirmation({
      message: `Você irá excluir o agendamento do dia ${formatedDate}. Tem certeza disso?`,
      onConfirmation: {
        title: "Sim, tenho certeza.",
        fn: () => {
          appointmentRepository
            .remove(appointment.id)
            .then(async () => {
              setSuccess({
                message: "Agendamento removido com sucesso.",
              });
              await loadPatients();
            })
            .catch((error: Error) =>
              setError({
                title: error.message,
                errors: error.cause,
              })
            );
        },
      },
      onFinally: () => reset(),
    });
  };

  const patientDeletion = (patient: PatientDTO) => {
    setDeleteConfirmation({
      message: `Atenção, esse registro do paciente ${patient.name} será permanenentemente excluídos sob normas da LGPD. Tem certeza disso?`,
      onConfirmation: {
        title: "Sim, tenho certeza.",
        fn: () => {
          patientRepository
            .lgpdDeletion(patient.id)
            .then(async () => {
              setSuccess({
                message: "Paciente removido com sucesso.",
              });
              await loadPatients();
            })
            .catch((error: Error) =>
              setError({
                title: error.message,
                errors: error.cause,
              })
            );
        },
      },
      onFinally: () => reset(),
    });
  };

  const loadDoctors = useCallback(async () => {
    userRepository
      .getAll({
        role: UserRoles.DOCTOR,
      })
      .then((doctors: UserDTO[]) =>
        setDoctorDropDownList(mapDoctorDropDownList(doctors))
      )
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  }, [userRepository]);

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, [loadPatients, loadDoctors]);

  return (
    <div className="container-home">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ margin: 10 }}>Pacientes</h1>
        <div id="new-patient" style={{ margin: 10 }}>
          <Link to={`/patients/new`}>
            <Button variant="contained" color="secondary">
              <PermContactCalendar />
              Novo
            </Button>
          </Link>
        </div>
        {success && <SuccessMessage {...success} />}
        {error && <ErrorMessage {...error} />}
        {deleteConfirmation && <DeleteConfirmation {...deleteConfirmation} />}
      </div>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {patients.map((patient: PatientDTO, i: number) => {
          return (
            <Grid item xs={6} key={`Grid-6-${i++}`}>
              <PatientCard
                key={`PatientCard-${i++}`}
                {...{
                  patient,
                  createPatientAppointment,
                  patientDeletion,
                }}
              >
                <PatientAppointmentsList
                  key={`PatientAppointmentsList-${i++}`}
                  appointments={patient.appointments || []}
                  deletePatientAppointment={deletePatientAppointment}
                />
              </PatientCard>
            </Grid>
          );
        })}
      </Grid>
      <PatientAppointmentModal
        {...{
          ...modalState,
          errorMessage: errorModal,
          doctorDropDownList,
        }}
      />
    </div>
  );
}
