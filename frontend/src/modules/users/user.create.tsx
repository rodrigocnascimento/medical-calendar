import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { CreateUserDTO, UserRoles } from "./index";
import { TErrorMessage } from "components/error";
import SuccessMessage, { TSuccessMessageProps } from "components/success";
import { useCases } from "context";

/**
 * Users form creation
 * @returns {JSX.Element}
 */
export function CreateUser(): JSX.Element {
  const {
    UserUseCases: { create },
  } = useCases();

  const history = useHistory();
  const initialFormState = {
    name: "",
    email: "",
    role: "",
    password: "",
    passwordConfirmation: "",
  };

  const [formInput, setFormInput] = useState<CreateUserDTO>(initialFormState);
  const [formInputErrors, setFormInputErrors] =
    useState<CreateUserDTO>(initialFormState);
  const [success, setSuccess] = useState<TSuccessMessageProps>();

  const reset = () => {
    setSuccess(undefined);
    setFormInput(initialFormState);
    setFormInputErrors(initialFormState);
  };

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    create(formInput, {
      onSuccess: () =>
        setSuccess({
          message: "Usuário criado com sucesso!",
          duration: 2500,
          handlerOnClose: () => {
            reset();
            history.push("/users");
          },
        }),
      onError: ({ errors }: TErrorMessage) => {
        setFormInputErrors({
          name: errors.name,
          email: errors.email,
          role: errors.role,
          password: errors.password,
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
        <h3 className="form-title">Usuário</h3>
        {success && <SuccessMessage {...success} />}
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="name"
            label="Nome do usuário"
            value={formInput.name}
            type="text"
            name="name"
            error={!!formInputErrors.name}
            helperText={formInputErrors.name}
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="email"
            label="Email do usuário"
            value={formInput.email}
            type="text"
            name="email"
            error={!!formInputErrors.email}
            helperText={formInputErrors.email}
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
            error={!!formInputErrors.role}
            helperText={formInputErrors.role}
            onChange={handleChange}
            style={{ width: 250 }}
          >
            <MenuItem value={""}>Selecione</MenuItem>
            <MenuItem value={UserRoles.ADMIN}>Admin</MenuItem>
            <MenuItem value={UserRoles.DOCTOR}>Médico</MenuItem>
            <MenuItem value={UserRoles.PATIENT}>Paciente</MenuItem>
          </TextField>
        </Grid>
        <Grid item style={{ margin: 10 }}>
          <TextField
            id="password"
            label="Senha do usuário"
            value={formInput.password}
            type="text"
            name="password"
            style={{ marginRight: 0, maxWidth: 250 }}
            error={!!formInputErrors.password}
            helperText={formInputErrors.password}
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
          <Button variant="contained" onClick={() => handleSubmit()}>
            <SaveAsIcon style={{ marginRight: 15 }} />
            Salvar Usuário
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
