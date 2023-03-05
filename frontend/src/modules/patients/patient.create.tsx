import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { TErrorMessage } from "components/error";
import { CreatePatientDTO, Genre } from "./index";
import SuccessMessage, { TSuccessMessageProps } from "components/success";

import { useCases } from "context";

/**
 * CreatePatient form creation
 * @returns {JSX.Element}
 */
export function CreatePatient(): JSX.Element {
  const {
    PatientUseCases: { create },
  } = useCases();

  const history = useHistory();

  const initialFormState = {
    name: "",
    email: "",
    dob: new Date(),
    phone: "",
    height: undefined,
    weight: undefined,
    genre: "",
  };

  const [formInput, setFormInput] =
    useState<CreatePatientDTO>(initialFormState);
  const [formInputErrors, setFormInputErrors] =
    useState<CreatePatientDTO>(initialFormState);

  const [startDate, setStartDate] = useState(new Date());
  const [success, setSuccess] = useState<TSuccessMessageProps>();

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const reset = () => {
    setSuccess(undefined);
    setFormInput(initialFormState);
    setFormInputErrors(initialFormState);
    setStartDate(new Date());
  };

  const handleSubmit = () => {
    create(formInput, {
      onSuccess: () =>
        setSuccess({
          duration: 25e2,
          message: "Paciente criado com sucesso!",
          handlerOnClose: () => {
            reset();
            history.push("/patients");
          },
        }),
      onError: ({ errors }: TErrorMessage) => {
        setFormInputErrors({
          name: errors.name,
          email: errors.email,
          phone: errors.phone,
          height: errors.height,
          weight: errors.weight,
          genre: errors.genre,
        });
      },
    });
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
        {success && <SuccessMessage {...success} />}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="name"
            label="Nome do paciente"
            value={formInput.name}
            error={!!formInputErrors.name}
            helperText={formInputErrors.name}
            type="text"
            name="name"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do paciente"
            value={formInput.email}
            error={!!formInputErrors.email}
            helperText={formInputErrors.email}
            type="text"
            name="email"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="phone"
            label="Telefone do paciente."
            value={formInput.phone}
            error={!!formInputErrors.phone}
            helperText={formInputErrors.phone}
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
              onChange={(newValue: any) => setStartDate(newValue)}
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
            value={formInput.height}
            error={!!formInputErrors.height}
            helperText={formInputErrors.height}
            type="text"
            name="height"
            onChange={handleChange}
          />
          <TextField
            id="weight"
            label="Peso do paciente."
            style={{ marginLeft: 20, marginRight: 10 }}
            value={formInput.weight}
            error={!!formInputErrors.weight}
            helperText={formInputErrors.weight}
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
            value={formInput.genre}
            error={!!formInputErrors.genre}
            helperText={formInputErrors.genre}
            label="Gênero"
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={""}>Selecione</MenuItem>
            <MenuItem value={Genre.F}>Feminino</MenuItem>
            <MenuItem value={Genre.M}>Masculino</MenuItem>
          </TextField>
        </Grid>

        <div className="button-right" style={{ margin: "20px 0 20px 0" }}>
          <Button variant="contained" onClick={() => handleSubmit()}>
            <SaveAsIcon style={{ verticalAlign: "bottom", marginRight: 15 }} />
            Salvar Paciente
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
