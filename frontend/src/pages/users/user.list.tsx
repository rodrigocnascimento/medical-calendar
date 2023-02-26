import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import { Create, PermContactCalendar, HighlightOff } from "@mui/icons-material";
import { UserDTO } from "./index";
import ErrorMessage, { TErrorMessage } from "components/error";
import {
  DeleteConfirmation,
  TDeleteConfirmation,
} from "components/delete-confirmation";

import SuccessMessage, { TSuccessMessageProps } from "components/success";
import { useAuth } from "context/auth/use-auth";

import "./users.css";
import { useRepository } from "context";

/**
 * This page is the dashboard of the module.
 *
 * @returns {JSX.Element} Dashboard Element
 */
export function ListUsers(): JSX.Element {
  const { user: userRepository } = useRepository();

  const auth = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<TSuccessMessageProps>();
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<TDeleteConfirmation>();

  const loadUsers = useCallback(async () => {
    const users = await userRepository.getAll();

    setUsers(users);
  }, [userRepository]);

  const reset = () => {
    setError(undefined);
    setSuccess(undefined);
  };

  const handleUserDeletion = (user: UserDTO) => {
    userRepository
      .remove(user.id)
      .then(async () => {
        setSuccess({
          message: "Usuário removido com sucesso.",
          handlerOnClose: () => {
            reset();
          },
        });
        await loadUsers();
      })
      .catch((error: Error) => {
        setError({
          title: error.message,
          errors: error.cause,
        });
      });
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="container-user">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 10 }}>Usuários</h1>
        <div id="new-patient" style={{ margin: 10 }}>
          <Link to={`/users/new`}>
            <Button variant="contained" color="secondary">
              <PermContactCalendar />
              Novo
            </Button>
          </Link>
        </div>
        {error && <ErrorMessage {...error} />}
        {success && <SuccessMessage {...success} />}
        {deleteConfirmation && <DeleteConfirmation {...deleteConfirmation} />}
      </div>
      {users &&
        users.map((user: UserDTO, i: number) => {
          return (
            <Card variant="outlined" key={i++} style={{ margin: 10 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {user.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <span style={{ fontWeight: "bold" }}>Email:</span>
                  {user.email}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Role:</span> {user.role}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Criado em:</span>
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(user.createdAt)
                  )}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Atualizado em:</span>
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(user.updatedAt)
                  )}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/users/${user.id}`}>
                  <Button style={{ margin: 10 }} variant="contained">
                    <Create />
                    Editar
                  </Button>
                </Link>
                {auth.user.sub !== user.id && (
                  <Button
                    style={{ margin: 10 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteConfirmation({
                        message: `Fazendo isso, você irá excluir o registro ${user.name}. Tem certeza disso?`,
                        onConfirmation: {
                          title: "Sim",
                          fn: () => handleUserDeletion(user),
                        },
                        onFinally: () => setDeleteConfirmation(undefined),
                      });
                    }}
                    color="error"
                    variant="contained"
                  >
                    <HighlightOff />
                    Excluir Usuário
                  </Button>
                )}
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
}
