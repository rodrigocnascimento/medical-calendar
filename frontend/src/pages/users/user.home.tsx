import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./users.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Create, PermContactCalendar, HighlightOff } from "@mui/icons-material";

export default function UsersHome({ repository: userRepository }: any) {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = useCallback(async () => {
    const users = await userRepository.getAll();

    setUsers(users);
  }, [userRepository]);

  const handleUserDeletion = (user: any) => {
    if (window.confirm("Deseja realmente excluir o usuário: " + user.name)) {
      userRepository
        .removeUser(user.id)
        .then(async (response: any) => {
          await loadUsers();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="container-home">
      <div className="header" style={{ width: "100%" }}>
        <h1 style={{ marginLeft: 20 }}>Usuários</h1>
        <div id="new-patient" style={{ margin: 20 }}>
          <Link className="patient_card__new" to={`/users/new`}>
            <PermContactCalendar style={{ verticalAlign: "bottom" }} />
            Novo
          </Link>
        </div>
      </div>
      {users &&
        users.map((user, i) => {
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
                <Link className="patient_card__category" to={`/users/${user.id}`}>
                  <Create style={{ verticalAlign: "bottom" }} />
                  Editar
                </Link>
                <a
                  href="dangerouslySetInnerHTML"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUserDeletion(user);
                  }}
                  className="patient_card__category danger"
                >
                  <HighlightOff style={{ verticalAlign: "bottom" }} />
                  Excluir Usuário
                </a>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
}
