# Medical Calendar

Este projeto é desenvolvido utilizando as seguintes ferramentas:

- NPM v8.19.3
- NodeJS v18.13.0
- Typescript v4.9.5
- Docker v23.0.1, build a5ee5b1
  - docker-compose version 1.29.2, build 5becea4c
- PostgreSQL v13.1
- NestJS v9.0.0
- React v18.2.0

## Iniciando o projeto

- Para inciar o projeto é necessário apenas executar o comando do `docker-compose` para levantar o container:

```bash
❯ docker-compose up
```

### ⚠️ Importante ⚠️

- No diretório do backend, é necessário rodar as migrations. Isso irá criar o banco de dados e o primeiro usuário Administrador do sistema.

```bash
❯ cd backend
❯ .bin/npm_run.sh migration:run
```

```txt
User Mestre
User: user_mestre@email.com
Pass: 123123

Médico 0
User: medico0@email.com
Pass: 123123
```

## Database

- No ambiente de desenvolvimento, para iniciar uma instância NOVA do banco de dados, primeiro deve ser removido o volume do container para garantir que o script de inicialização será executado:

  - A primeira vez que o `docker-compose` for executado, não há a necessidade de remover o volume, pois como o do banco de dados ainda não existe, o container irá executar o script de inicialização presente no diretório de inicialização do banco de dados.
  - Que por sua vez executa o arquivo `pgsql_dump.sql` com o DDL inicial do banco de dados.

    > `database/docker-entrypoint-initdb.d/init-user-db.sh`

```bash
❯ docker volume rm medical-calendar_psql-data
❯ sudo rm -rf database/psql-data # caso o comnado docker ñ tenha funcionado
```

## Migrations

- Rodando as migrations.

```bash
❯ .bin/npm_run.sh migration:run
```

### Development

- Para gerar migrations baseadas nas Entidades da aplicação executar o seguinte comando, após ter definido toda a entity.

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

## Acessando o projeto MedApp

- Após isso, para entrar no sistema, acesse: http://localhost

## Documentação

- A documentação do projeto é feita de maneira automatizada, usando a ferramente Swagger.
  - http://localhost:3420/docs

### Compliance LGPD

- Quando solicitada a DELEÇÃO do Paciente, os seus dados são completamente apagados do sistema. Porém
  antes que isso aconteça, esses dados são criptografados, com uma criptografia de duas vias, onde é possível
  descriptografar, caso seja necessário para algum tipo de resposta a algum órgão que exija. Esse registro, então,
  é deletado usando um [`"softDelete"`](https://typeorm.io/delete-query-builder#soft-delete) para que seja possível recuperar a chave de descriptografia dos dados. Por fim, a Entity,
  deixará de aparecer em todas as consultas, a menos que seja solicitada de maneira explícita ou seja feito um recover do dado.
