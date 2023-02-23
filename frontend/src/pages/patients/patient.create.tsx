import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";
import TextField from "@mui/material/TextField";

export default function PatientsCreate({ repository: patientRepository }: any) {
  let { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [inputs, setInputs] = useState<any>({});
  const [error, setError] = useState<any>();
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "dob") {
      console.log(value, new Date(value));
      inputs.dobFormated = new Intl.DateTimeFormat("pt-BR").format(
        new Date(value + "T00:00:00")
      );
      inputs.dob = new Intl.DateTimeFormat().format(
        new Date(value + "T00:00:00")
      );
      console.log(inputs.dob);
    }

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

    patientRepository
      .createPatient(inputs)
      .then((response: any) => {
        console.log("response", response);
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
    <>
      <form
        onSubmit={(e) =>
          id !== "new" ? handlePatientEdition(e) : handleSubmit(e)
        }
      >
        <div className="form-content">
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
          <div className="form-group">
            <label>Nome</label>
            <TextField
              id="name"
              placeholder="Nome do paciente"
              value={inputs.name || ""}
              type="text"
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              id="email"
              placeholder="Email do paciente"
              value={inputs.email || ""}
              type="text"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Data {inputs.dobFormated || new Date().toISOString()}</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Basic example"
                value={startDate}
                onChange={(newValue: any) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input
              id="phone"
              placeholder="Telefone do paciente."
              value={inputs.phone || ""}
              type="text"
              name="phone"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Altura</label>
            <input
              id="height"
              placeholder="Altura do paciente."
              value={inputs.height || ""}
              type="text"
              name="height"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Peso</label>
            <input
              id="weight"
              placeholder="Peso do paciente."
              value={inputs.weight || ""}
              type="text"
              name="weight"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gênero</label>
            <select
              name="genre"
              value={inputs.genre || ""}
              onChange={handleChange}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          {id !== "new" && (
            <input value={inputs.id || ""} type="hidden" name="id" />
          )}
          <div className="button-right">
            <button type="submit">Enviar</button>
          </div>
        </div>
      </form>
    </>
  );
}
