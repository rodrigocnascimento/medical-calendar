import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";

export default function UsersCreate({ repository: userRepository }: any) {
  let { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [inputs, setInputs] = useState<any>({});
  const [error, setError] = useState<any>();

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const loadUser = useCallback(async () => {
    userRepository
      .getById(id)
      .then((response: any) => {
        console.log("loadUser response", response);
        setInputs(response);
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
  }, [id, userRepository]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log({ inputs });

    if (
      inputs.password !== inputs.rePass ||
      inputs.password === "" ||
      inputs.rePass === "" ||
      !inputs.rePass ||
      !inputs.password
    ) {
      setError([
        {
          password: ["As duas senhas não são iguais!"],
        },
      ]);
      return;
    }

    setError(null);

    userRepository
      .createUser(inputs)
      .then((response: any) => {
        console.log("response", response);
        history.push("/users");
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
  };

  const handleUserEdition = (event: any) => {
    event.preventDefault();

    setError(null);

    userRepository
      .editUser(inputs.id, inputs)
      .then((response: any) => {
        console.log("response", response);
        history.push("/users");
      })
      .catch((error: any) => {
        setError(JSON.parse(error.message).message);
      });
  };

  useEffect(() => {
    if (id !== "new") {
      loadUser();
    }
  }, [id, loadUser]);

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
        <h3 className="form-title">Usuário</h3>
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
            label="Nome do usuário"
            value={inputs.name || ""}
            type="text"
            name="name"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do usuário"
            value={inputs.email || ""}
            type="text"
            name="email"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <TextField
            select
            id="role"
            name="role"
            value={inputs.role || ""}
            label="Role"
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={"admin"}>Admin</MenuItem>
            <MenuItem value={"doctor"}>Médico</MenuItem>
            <MenuItem value={"patient"}>Paciente</MenuItem>
          </TextField>
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="password"
            label="Senha do usuário"
            value={inputs.password || ""}
            type="text"
            name="password"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="rePass"
            label="Confirme a senha do usuário"
            value={inputs.rePass || ""}
            type="text"
            name="rePass"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
        </Grid>
        {id !== "new" && <input value={inputs.id || ""} type="hidden" name="id" />}
        <div className="button-right" style={{ margin: "20px 0 20px 0" }}>
          <Button
            type="submit"
            variant="contained"
            onClick={(e) => (id !== "new" ? handleUserEdition(e) : handleSubmit(e))}
          >
            <SaveAsIcon style={{ verticalAlign: "bottom", marginRight: 15 }} />
            {id !== "new" ? "Editar Usuário" : "Salvar Usuário"}
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
