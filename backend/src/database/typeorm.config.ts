import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface DatabaseConfigInterface {
  DATABASE: DataSourceOptions;
}

export default {
  type: process.env.DATABASE_TYPE as PostgresConnectionOptions['type'],
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  migrationsTableName: 'pebmed_medapp_migrations',
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/database/migrations/*{.js,.ts}'],
  autoLoadEntities: true,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  synchronize: false,
  name: 'default',
} as DataSourceOptions;
