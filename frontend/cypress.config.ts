import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    baseUrl: "http://localhost/",
    ADMIN: {
      username: "user_mestre@email.com",
      password: "123123",
    },
    DOCTOR: {
      username: "medico0@email.com",
      password: "123123",
    },
  },
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
