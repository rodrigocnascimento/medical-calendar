import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import { PermContactCalendar } from "@mui/icons-material";

import { useAuth, useCases } from "context";
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
    PatientUseCases: { loadAll: loadAllPatients, lgpdRemoval },
    UserUseCases: { loadAll: loadAllDoctors },
    AppointmentUseCases: {
      create: createAppointment,
      remove: removeAppointment,
    },
  } = useCases();

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

  const loadPatients = useCallback(
    () =>
      loadAllPatients(
        {},
        {
          onSuccess: (patient: PatientDTO[]) => setPatients(patient),
          onError: ({ errors }: TErrorMessage) =>
            setError({
              title: "Erro ao carregar o pacientes!",
              errors,
            }),
        }
      ),
    [loadAllPatients]
  );

  const loadDoctors = useCallback(
    async () =>
      loadAllDoctors(
        {
          role: UserRoles.DOCTOR,
        },
        {
          onSuccess: (doctors: UserDTO[]) =>
            setDoctorDropDownList(mapDoctorDropDownList(doctors)),
          onError: ({ title, errors }: TErrorMessage) =>
            setError({
              title: "Erro ao carregar os médicos!",
              errors,
            }),
        }
      ),
    [loadAllDoctors]
  );

  const createPatientAppointment = useCallback(
    (patient: Partial<PatientDTO>) => {
      setModalState({
        open: !!patient.id,
        patient,
        handleAppointmentCreation: (appointmentDoctor, appointmentDate) => {
          if (auth.user.userRole === UserRoles.DOCTOR) {
            appointmentDoctor.id = auth.user.sub;
          }

          createAppointment(patient, appointmentDoctor, appointmentDate, {
            onSuccess: () => {
              setSuccess({
                message: "Agendamento criadon com sucesson bicha!",
                handlerOnClose: () => {
                  reset();
                  loadPatients();
                },
              });
            },
            onError: ({ title, errors }: TErrorMessage) => {
              setErrorModal({
                title,
                errors,
              });
            },
          });
        },
        onCloseHandler: () => reset(),
      });
    },
    [auth, loadPatients, createAppointment]
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
        fn: () =>
          removeAppointment(appointment, {
            onSuccess: () => {
              setSuccess({
                message: "Agendamento removido com sucesso.",
                handlerOnClose: () => {
                  reset();
                  loadPatients();
                },
              });
            },
            onError: ({ title, errors }: TErrorMessage) =>
              setError({
                title,
                errors,
              }),
          }),
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
          lgpdRemoval(patient, {
            onSuccess: () => {
              setSuccess({
                message: "Paciente removido com sucesso.",
                handlerOnClose: () => {
                  reset();
                  loadPatients();
                },
              });
            },
            onError: ({ title, errors }: TErrorMessage) =>
              setError({ title, errors }),
          });
        },
      },
      onFinally: () => reset(),
    });
  };

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
