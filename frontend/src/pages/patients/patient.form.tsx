import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ErrorMessage, { TErrorMessage } from "../../components/error";
import { CreatePatientDTO, Genre, PatientDTO, UpdatePatientDTO } from "./patient.interfaces";
import { IPatientRepository } from "./patient.repository";
import { ValidationError } from "yup";
import { mapperYupErrorsToErrorMessages } from "../../domain/yup.mapper-errors";
import { patientValidation } from "./patient.validation";
import SuccessMessage from "../../components/success";

/**
 * The basic ideia of this page is to allow the creation and edidion of a form.
 *
 * The `"/path/:id"` param is a param that matches on the route and is treated as a value that needs to be fetched
 * as soons as possible the component allows it. If the value of that `"id"` is equal to `"new"` it will
 * assume that is a new entity that will be created.
 *
 * @param {UsersComponentProps} { repository } IRepository injected repository
 * @returns {JSX.Element} Form Element
 */
export function PatientsForm({ repository }: any): JSX.Element {
  const history = useHistory();
  let { id } = useParams<{ id: string }>();

  const patientRepository: IPatientRepository = repository;

  const [formInput, setFormInput] = useState<CreatePatientDTO | UpdatePatientDTO>({
    id: "",
    name: "",
    email: "",
    dob: new Date(),
    phone: "",
    height: 0,
    weight: 0,
    genre: Genre.F,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<string>("");

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const loadPatient = useCallback(async () => {
    patientRepository
      .getById(id)
      .then((patient: PatientDTO) => setFormInput(patient))
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  }, [id, patientRepository]);

  const handleSubmit = () => {
    const formManager = id === "new" ? patientRepository.create : patientRepository.edit;

    patientValidation
      .validate(formInput, { abortEarly: false })
      .then(() =>
        formManager
          .call(patientRepository, formInput)
          .then(() => {
            setSuccess("Paciente criado com sucesso!");
            setTimeout(() => history.push("/patients"), 25e2);
          })
          .catch((error: Error) =>
            setError({
              title: error.message,
              errors: error.cause,
            })
          )
      )
      .catch((validationErrors: ValidationError) =>
        setError({
          title: "Erro ao criar o paciente.",
          errors: mapperYupErrorsToErrorMessages(validationErrors),
        })
      );
  };

  useEffect(() => {
    if (id !== "new") {
      loadPatient();
    }
  }, [id, loadPatient]);

  return (
    <Grid
      container
      style={{
        margin: 100,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 20,
      }}
    >
      <FormControl style={{ backgroundColor: "white" }}>
        <h3 className="form-title">👩‍⚕️ Ficha do paciente 👨‍⚕️</h3>
        {error && <ErrorMessage {...error} />}
        {success && <SuccessMessage message={success} />}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="name"
            label="Nome do paciente"
            value={formInput.name || ""}
            type="text"
            name="name"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do paciente"
            value={formInput.email || ""}
            type="text"
            name="email"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="phone"
            label="Telefone do paciente."
            value={formInput.phone || ""}
            type="text"
            name="phone"
            style={{ marginLeft: 20, marginRight: 10 }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month", "day"]}
              label="Data de aniversário"
              value={startDate}
              onChange={(newValue: any) => {
                setStartDate(newValue);
              }}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => (
                <TextField style={{ marginRight: 0, width: 245 }} {...params} />
              )}
            />
          </LocalizationProvider>
          <TextField
            id="height"
            label="Altura do paciente."
            style={{ marginLeft: 20, marginRight: 0 }}
            value={formInput.height || ""}
            type="text"
            name="height"
            onChange={handleChange}
          />
          <TextField
            id="weight"
            label="Peso do paciente."
            style={{ marginLeft: 20, marginRight: 10 }}
            value={formInput.weight || ""}
            type="text"
            name="weight"
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <TextField
            select // tell TextField to render select
            id="genre"
            name="genre"
            value={formInput.genre || ""}
            label="Gênero"
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={"F"}>Feminino</MenuItem>
            <MenuItem value={"M"}>Masculino</MenuItem>
          </TextField>
        </Grid>
        {id !== "new" && <input value={formInput.id || ""} type="hidden" name="id" />}
        <div className="button-right" style={{ margin: "20px 0 20px 0" }}>
          <Button
            type="submit"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <SaveAsIcon style={{ verticalAlign: "bottom", marginRight: 15 }} />
            {id !== "new" ? "Editar Paciente" : "Salvar Paciente"}
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
