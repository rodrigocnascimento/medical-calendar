import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ErrorMessage, { TErrorMessage } from "../../components/error";
import { PatientDTO } from "./patient.interfaces";
import { IPatientRepository } from "./patient.repository";

/**
 * The patient creation component.
 * The "id" param could assume the patient id on database or could be "new"
 * that indicates that the patient is being created on the other hand
 * if it has a "id" or anything different from "new", it will assume that
 * is an patient edition.
 *
 * @param repository The repositories used on the component
 * @returns {JSX.Element} PatientCreate Element
 */
export default function PatientsCreate({ repository }: any): JSX.Element {
  const history = useHistory();
  let { id } = useParams<{ id: string }>();

  const patientRepository: IPatientRepository = repository;
  const [inputs, setInputs] = useState<any>();
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState<TErrorMessage>();

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const loadPatient = useCallback(async () => {
    patientRepository
      .getById(id)
      .then((patient: PatientDTO) => setInputs(patient))
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        }),
      );
  }, [id, patientRepository]);

  const handleSubmit = () => {
    const userManaging =
      id !== "new"
        ? patientRepository.editPatient(inputs)
        : patientRepository.createPatient(inputs);

    // format the DOB before send
    inputs.dob = new Date(startDate);

    userManaging
      .then(() => history.push("/patients"))
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        }),
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
        <h3 className='form-title'>👩‍⚕️ Ficha do paciente 👨‍⚕️</h3>
        {error && <ErrorMessage title={error.title} errors={error.errors} />}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id='name'
            label='Nome do paciente'
            value={inputs.name || ""}
            type='text'
            name='name'
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id='email'
            label='Email do paciente'
            value={inputs.email || ""}
            type='text'
            name='email'
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id='phone'
            label='Telefone do paciente.'
            value={inputs.phone || ""}
            type='text'
            name='phone'
            style={{ marginLeft: 20, marginRight: 10 }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month", "day"]}
              label='Data de aniversário'
              value={startDate}
              onChange={(newValue: any) => {
                setStartDate(newValue);
              }}
              inputFormat='dd/MM/yyyy'
              renderInput={(params) => (
                <TextField style={{ marginRight: 0, width: 245 }} {...params} />
              )}
            />
          </LocalizationProvider>
          <TextField
            id='height'
            label='Altura do paciente.'
            style={{ marginLeft: 20, marginRight: 0 }}
            value={inputs.height || ""}
            type='text'
            name='height'
            onChange={handleChange}
          />
          <TextField
            id='weight'
            label='Peso do paciente.'
            style={{ marginLeft: 20, marginRight: 10 }}
            value={inputs.weight || ""}
            type='text'
            name='weight'
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <TextField
            select // tell TextField to render select
            id='genre'
            name='genre'
            value={inputs.genre || ""}
            label='Gênero'
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={"F"}>Feminino</MenuItem>
            <MenuItem value={"M"}>Masculino</MenuItem>
          </TextField>
        </Grid>
        {id !== "new" && <input value={inputs.id || ""} type='hidden' name='id' />}
        <div className='button-right' style={{ margin: "20px 0 20px 0" }}>
          <Button
            type='submit'
            variant='contained'
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
