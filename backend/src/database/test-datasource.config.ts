import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../users/user.entity";
import { MedicalAppointment } from "../medical_appointments/medical_appointments.entity";
import { MedicalRegistry } from "../medical_registries/medical_registry.entity";
import { Patient } from "../patients/patient.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const testDatabaseConfigs = {
  type: process.env.DATABASE_TYPE as PostgresConnectionOptions["type"],
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  migrationsTableName: "medapp_e2e_migrations",
  database: "medapp_e2e_test",
  subscribers: ["dist/**/*.subscriber{.js,.ts}"],
  migrations: ["dist/database/migrations/*{.js,.ts}"],
  autoLoadEntities: true,
  cli: {
    migrationsDir: "src/database/migrations",
  },
  synchronize: false,
  name: "default",
  entities: [User, MedicalAppointment, MedicalRegistry, Patient],
  logging: false,
} as DataSourceOptions;

export const TestDataSourceSetup = new DataSource(testDatabaseConfigs);

export async function setupE2EDB(showLogs = false) {
  showLogs && console.log("initializing connection");
  await TestDataSourceSetup.initialize();
  showLogs && console.log("connection established", testDatabaseConfigs);

  showLogs && console.log("running migrations");
  await TestDataSourceSetup.runMigrations();
}

export async function closeE2ETests() {
  await TestDataSourceSetup.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  await TestDataSourceSetup.destroy();
}
