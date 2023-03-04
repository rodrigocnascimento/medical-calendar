import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { TextField, FormControl, Button, MenuItem, Grid } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { UpdateUserDTO, UserDTO, UserRoles } from "./index";
import ErrorMessage, { TErrorMessage } from "components/error";
import SuccessMessage, { TSuccessMessageProps } from "components/success";
import { useCases } from "context";

/**
 * The `"/path/:id"` param is a param that matches on the route and is treated as a value that needs to be fetched
 * as soons as possible
 *
 * @returns {JSX.Element} Form Element
 */
export function UpdateUser(): JSX.Element {
  const {
    UserUseCases: { load, edit },
  } = useCases();

  let { id } = useParams<{ id: string }>();

  const history = useHistory();

  const initialFormState = {
    id: "",
    name: "",
    email: "",
    role: "",
    password: "",
    passwordConfirmation: "",
  };

  const [formInput, setFormInput] = useState<UpdateUserDTO>(initialFormState);
  const [formInputErrors, setFormInputErrors] =
    useState<UpdateUserDTO>(initialFormState);

  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<TSuccessMessageProps>();

  const handleChange = (event: any) => {
    const name = event.target.name;
    let value = event.target.value;

    setFormInput((values: any) => ({ ...values, [name]: value }));
  };

  const loadUser = useCallback(
    (id: UpdateUserDTO["id"]) =>
      load(id, {
        onSuccess: (user: UserDTO) => setFormInput(user),
        onError: ({ errors }: TErrorMessage) =>
          setError({
            title: "Erro ao carregar o usuário!",
            errors,
          }),
      }),
    [load]
  );

  const reset = () => {
    setError(undefined);
    setSuccess(undefined);
    setFormInput(initialFormState);
    setFormInputErrors(initialFormState);
  };

  const handleSubmit = () => {
    edit(formInput, {
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

  useEffect(() => {
    loadUser(id);
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
        {error && <ErrorMessage {...error} />}
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
            error={!!formInputErrors.role}
            helperText={formInputErrors.role}
            value={formInput.role}
            label="Role"
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
            error={!!formInputErrors.name}
            helperText={formInputErrors.name}
            style={{ marginRight: 0 }}
            onChange={handleChange}
          />
          <TextField
            id="passwordConfirmation"
            label="Confirme a senha do usuário"
            value={formInput.passwordConfirmation}
            type="text"
            name="passwordConfirmation"
            error={!!formInputErrors.name}
            helperText={formInputErrors.name}
            style={{ marginLeft: 20, marginRight: 0 }}
            onChange={handleChange}
          />
        </Grid>
        <input value={formInput.id} type="hidden" name="id" />
        <div className="button-right" style={{ margin: "20px 0 20px 0" }}>
          <Button variant="contained" onClick={() => handleSubmit()}>
            <SaveAsIcon style={{ marginRight: 15 }} />
            Editar Usuário
          </Button>
        </div>
      </FormControl>
    </Grid>
  );
}
