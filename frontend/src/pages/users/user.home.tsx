import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

import { Create, PermContactCalendar, HighlightOff } from "@mui/icons-material";
import { UserDTO, UsersComponentProps } from "./user.interfaces";
import ErrorMessage, { TErrorMessage } from "../../components/error";
import { DeleteConfirmation, TDeleteConfirmation } from "../../components/delete-confirmation";

import SuccessMessage from "../../components/success";
import { useAuth } from "../../context/auth/use-auth";

import "./users.css";
export default function UsersHome({ repository }: UsersComponentProps) {
  const { user: userRepository } = repository;

  const auth = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [error, setError] = useState<TErrorMessage>();
  const [success, setSuccess] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<TDeleteConfirmation>();

  const loadUsers = useCallback(async () => {
    const users = await userRepository.getAll();

    setUsers(users);
  }, [userRepository]);

  const handleUserDeletion = (user: UserDTO) => {
    userRepository
      .removeUser(user.id)
      .then(async () => {
        setSuccess("Usuário removido com sucesso.");
        await loadUsers();
      })
      .catch((error: Error) =>
        setError({
          title: error.message,
          errors: error.cause,
        })
      );
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="container-home">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 10 }}>Usuários</h1>
        <div id="new-patient" style={{ margin: 10 }}>
          <Link to={`/users/new`}>
            <Button variant="contained" color="secondary">
              <PermContactCalendar style={{ verticalAlign: "bottom" }} />
              Novo
            </Button>
          </Link>
        </div>
        {error && <ErrorMessage {...error} />}
        {success && <SuccessMessage message={success} />}
        {deleteConfirmation && <DeleteConfirmation {...deleteConfirmation} />}
      </div>
      {users &&
        users.map((user: UserDTO, i: number) => {
          console.log(auth.user.sub, user.id);
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
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(user.createdAt))}
                  <br />
                  <span style={{ fontWeight: "bold" }}>Atualizado em:</span>
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(user.updatedAt))}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/users/${user.id}`}>
                  <Button style={{ margin: 10 }} variant="contained">
                    <Create style={{ verticalAlign: "bottom" }} />
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
                    <HighlightOff style={{ verticalAlign: "bottom" }} />
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
