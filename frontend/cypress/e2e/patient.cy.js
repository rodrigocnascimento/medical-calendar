describe("Patients appointments", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("baseUrl")}`);

    cy.get("input#username").type(Cypress.env("ADMIN").username);
    cy.get("input#password").type(Cypress.env("ADMIN").password);
    cy.get("[type='submit']").click();

    cy.contains("Pacientes");

    cy.url().should("be.equal", Cypress.env("baseUrl"));
  });

  it("should create an patient appointment", () => {
    const date = new Date();

    cy.visit(`${Cypress.env("baseUrl")}/patients`);

    const appointmentBtn = cy.get("button").contains("Agendar horário");
    appointmentBtn.should("exist");
    appointmentBtn.click();

    cy.get("#modal-modal-description").contains(
      "Confirme a data da reserva da consulta."
    );

    cy.get("#doctor").type("Medico 0").get('li[data-option-index="0"]').click();

    cy.get(".MuiInputAdornment-root > button").click();
    cy.get(".MuiPickersDay-today").click();
    cy.get(`[aria-label="${(date.getHours() + 2) % 12 || 12} hours"]`).click({
      force: true,
    });

    cy.get("button").contains("Confirmar agendamento").click({
      force: true,
    });

    cy.get(".MuiAlert-message").contains("Já tem uma consulta nesse horário.");
  });
});
