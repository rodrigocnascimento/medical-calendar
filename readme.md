# PEDMED Medical Calendar

Este projeto é desenvolvido utilizando as seguintes ferramentas:

- NPM v8.19.3
- NodeJS v18.13.0
- Typescript v4.9.5
- Docker v23.0.1, build a5ee5b1
- PostgreSQL v13.1
- NestJS v9.0.0
- React v18.2.0

## Iniciando o projeto

- Para inciar o projeto é necessário apenas executar o comando do `docker-compose` para levantar o container:

```bash
❯ docker-compose up
```

## Database

- No ambiente de desenvolvimento, para iniciar uma instância NOVA do banco de dados, primeiro deve ser removido o volume do container para garantir que o script de inicialização será executado:
  - A primeira que o `docker-compose` for executado, não há a necessidade de remover o volume, pois como o do banco de dados ainda não existe, o container, irá executar o script de inicialização presente no diretório:
    > `database/docker-entrypoint-initdb.d/init-user-db.sh`
  - Que por sua vez executa o arquivo `pgsql_dump.sql` com o DDL inicial do banco de dados.

```bash
❯ docker volume rm medical-calendar_psql-data
```
