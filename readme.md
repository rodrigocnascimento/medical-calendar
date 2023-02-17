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

  - A primeira vez que o `docker-compose` for executado, não há a necessidade de remover o volume, pois como o do banco de dados ainda não existe, o container irá executar o script de inicialização presente no diretório de inicialização do banco de dados.
  - Que por sua vez executa o arquivo `pgsql_dump.sql` com o DDL inicial do banco de dados.

    > `database/docker-entrypoint-initdb.d/init-user-db.sh`

```bash
❯ docker volume rm medical-calendar_psql-data
```

## Migrations

- Para o projeto ser iniciado, é preciso rodar as migrations;

```bash
❯ .bin/npm_run.sh migration:run
```

### Development

- Para gerar migrations baseadas nas Entidades da aplicação executar o seguinte comando:

```bash
❯ .bin/npm_run.sh migration:generate --name=<migration_name>
```

## Helpers

- Este projeto conta com um script para execução dos comandos `npm` dentro do container de backend, onde o primeiro argumento é o comando `npm` a ser executado e o segundo parâmetro são argumentos adicionais ao comando a ser executado.

```bash
❯ .bin/npm_run.sh <npm run commands> $1 $2
```

- Input:

> `.bin/npm_run.sh migration:generate --name=Patient`

- Output:

> `npm run build && npx typeorm -d dist/database/datasource.config.js migration:generate src/database/migrations/Patient`

## Acessando o projeto

- Após isso, para entrar no sistema, acesse: [PEBMED MedApp](http://localhost)

## Documentação

- A documentação do projeto é feita de maneira automatizada, usando a ferramente Swagger.
  - [Documentação](http://localhost:3420/docs)
