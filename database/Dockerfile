FROM fantix/postgres-ssl:13.1

ADD /docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/

COPY ./scripts/pg_dump.sql ./scripts/pg_dump.sql