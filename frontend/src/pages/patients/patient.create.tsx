import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ErrorMessage, { TErrorMessage } from "components/error";
import { CreatePatientDTO, Genre, patientValidation } from "./index";
import { ValidationError } from "yup";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import SuccessMessage, { TSuccessMessageProps } from "components/success";
import { useRepository } from "context";

/**
 * CreatePatient form creation
 * @returns {JSX.Element}
 */
export function CreatePatient(): JSX.Element {
  const { patient: patientRepository } = useRepository();
  const history = useHistory();

  const initialFormState = {
    name: "",
    email: "",
    dob: new Date(),
    phone: "",
    height: 0,
    weight: 0,
    genre: Genre.F,
  };

  const [formInput, setFormInput] =
    useState<CreatePatientDTO>(initialFormState);

  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<TSuccessMessageProps>();

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const reset = () => {
    setError(undefined);
    setSuccess(undefined);
    setFormInput(initialFormState);
    setStartDate(new Date());
  };

  const handleSubmit = () => {
    patientValidation
      .validate(formInput, { abortEarly: false })
      .then(() =>
        patientRepository
          .create(formInput)
          .then(() => {
            setSuccess({
              duration: 25e2,
              message: "Paciente criado com sucesso!",
              handlerOnClose: () => {
                reset();
                history.push("/patients");
              },
            });
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
        {success && <SuccessMessage {...success} />}
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
            Salvar Paciente
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
