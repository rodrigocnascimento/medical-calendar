import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { ValidationError } from "yup";
import { mapperYupErrorsToErrorMessages } from "domain/yup.mapper-errors";
import { CreateUserDTO, UserRoles, userValidation } from "./index";
import ErrorMessage, { TErrorMessage } from "components/error";
import SuccessMessage from "components/success";
import { useRepository } from "context";

/**
 * Users form creation
 * @returns {JSX.Element}
 */
export function CreateUser(): JSX.Element {
  const { user: userRepository } = useRepository();
  const history = useHistory();

  const [formInput, setFormInput] = useState<CreateUserDTO>({
    name: "",
    email: "",
    role: UserRoles.DOCTOR,
    password: "",
    passwordConfirmation: "",
  });

  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<string>("");

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    userValidation
      .validate(formInput, { abortEarly: false })
      .then(() =>
        userRepository
          .create(formInput)
          .then(() => {
            setSuccess("Usuário criado com sucesso!");
            setTimeout(() => history.push("/users"), 25e2);
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
          title: "Erro ao criar o usuário.",
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
        <h3 className="form-title">Usuário</h3>
        {error && <ErrorMessage {...error} />}
        {success && <SuccessMessage message={success} />}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="name"
            label="Nome do usuário"
            value={formInput.name}
            type="text"
            name="name"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do usuário"
            value={formInput.email}
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
            value={formInput.role}
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
            value={formInput.password}
            type="text"
            name="password"
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="passwordConfirmation"
            label="Confirme a senha do usuário"
            value={formInput.passwordConfirmation}
            type="text"
            name="passwordConfirmation"
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
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
            <SaveAsIcon style={{ marginRight: 15 }} />
            Salvar Usuário
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
