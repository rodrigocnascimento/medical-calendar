import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";

export default function PatientsCreate({ repository: patientRepository }: any) {
  let { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [inputs, setInputs] = useState<any>({});
  const [error, setError] = useState<any>();
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const loadPatient = useCallback(async () => {
    patientRepository
      .getById(id)
      .then((response: any) => {
        console.log("loadPatient response", response);
        setInputs(response);
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
  }, [id, patientRepository]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setError(null);

    // format the DOB before send
    inputs.dob = new Date(startDate);

    patientRepository
      .createPatient(inputs)
      .then((response: any) => {
        console.log("response", response);
        history.push("/patients");
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
  };

  const handlePatientEdition = (event: any) => {
    event.preventDefault();

    setError(null);

    delete inputs.appointments;

    patientRepository
      .editPatient(inputs)
      .then((response: any) => {
        console.log("response", response);
        history.push("/patients");
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
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
        {error && (
          <ul
            style={{
              border: "3px solid red",
              borderRadius: 5,
              padding: 30,
              backgroundColor: "pink",
            }}
          >
            {Object.keys(error[0])?.map((err: any, i: number) => {
              return (
                <li key={i++}>
                  {err}: {error[0][err]}
                </li>
              );
            })}
          </ul>
        )}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="name"
            label="Nome do paciente"
            value={inputs.name || ""}
            type="text"
            name="name"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do paciente"
            value={inputs.email || ""}
            type="text"
            name="email"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="phone"
            label="Telefone do paciente."
            value={inputs.phone || ""}
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
            value={inputs.height || ""}
            type="text"
            name="height"
            onChange={handleChange}
          />
          <TextField
            id="weight"
            label="Peso do paciente."
            style={{ marginLeft: 20, marginRight: 10 }}
            value={inputs.weight || ""}
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
            value={inputs.genre || ""}
            label="Gênero"
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={"F"}>Feminino</MenuItem>
            <MenuItem value={"M"}>Masculino</MenuItem>
          </TextField>
        </Grid>
        {id !== "new" && (
          <TextField value={inputs.id || ""} type="hidden" name="id" />
        )}
        <div className="button-right" style={{ margin: "20px 0 20px 0" }}>
          <Button
            type="submit"
            variant="contained"
            onClick={(e) =>
              id !== "new" ? handlePatientEdition(e) : handleSubmit(e)
            }
          >
            <SaveAsIcon style={{ verticalAlign: "bottom", marginRight: 15 }} />
            {id !== "new" ? "Editar Paciente" : "Salvar Paciente"}
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
