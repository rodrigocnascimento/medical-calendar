import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import {
  Create,
  PermContactCalendar,
  CalendarMonth,
  HighlightOff,
} from "@mui/icons-material";

import { useAuth, useRepository } from "context";
import {
  DoctorMUIDropDownListDTO,
  UserDTO,
  UserRoles,
  mapperDoctorListDropDown,
} from "../users";
import { PatientDTO } from "./index";
import { AppointmentDTO } from "../appointments";

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
} from "./patient-appointment.modal";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import { appointmentCreationValidation } from "modules/appointments/appointments.validation";
import { ValidationError } from "yup";

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

  const handlePatientAppointmentCreationModal = useCallback(
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
                  setError({
                    title: error.message,
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
        onCloseHandler: () => {
          console.log("aqui");
          reset();
        },
      });
    },
    [appointmentRepository, auth, loadPatients]
  );

  const handlePatienteDeletion = (patient: PatientDTO) => {
    setDeleteConfirmation({
      message: `Confirmando essa ação, você irá excluir o registro ${patient.name}. Tem certeza disso?`,
      onConfirmation: {
        title: "Sim, tenho certeza.",
        fn: () => {
          patientRepository
            .remove(patient.id)
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
        setDoctorDropDownList(mapperDoctorListDropDown(doctors))
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
      {patients &&
        patients.map((patient: PatientDTO, i: number) => {
          return (
            <Card variant="outlined" key={i++} style={{ margin: 10 }}>
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
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(patient.dob)
                  )}
                  <br />
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Criado em:
                  </span>{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(patient.createdAt)
                  )}
                </Typography>
                <Typography variant="h6">Agendamentos do Paciente</Typography>
                <ul>
                  {patient.appointments &&
                    patient.appointments.map(
                      (appointment: AppointmentDTO, i: number) => (
                        <li key={i++}>
                          Data/Horário:{" "}
                          {new Intl.DateTimeFormat("pt-BR", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: false,
                          }).format(new Date(appointment.date))}
                        </li>
                      )
                    )}
                </ul>
              </CardContent>
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
                  onClick={() => handlePatientAppointmentCreationModal(patient)}
                >
                  <CalendarMonth />
                  Agendar horário
                </Button>
                {auth.user.userRole === UserRoles.ADMIN && (
                  <Button
                    style={{ margin: 10 }}
                    variant="contained"
                    color="error"
                    onClick={() => handlePatienteDeletion(patient)}
                  >
                    <HighlightOff />
                    Excluir Paciente
                  </Button>
                )}
              </CardActions>
            </Card>
          );
        })}
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
