describe("First e2e React testing", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  it("should enter initial page and should be the login page", () => {
    cy.get(".form-title").should("exist").and("be.visible").contains("Sign In");
    cy.get("input#username").should("exist").and("be.visible");
    cy.get("input#password").should("exist").and("be.visible");
  });

  it("should not authenticate and throw an error", () => {
    cy.get("input#username").type("user_random@email.com");
    cy.get("input#password").type("abc123");
    cy.get("[type='submit']").click();

    cy.contains("Usuário não econtrado.");
  });

  it("should authenticate and redirect to the right page", () => {
    cy.get("input#username").type(Cypress.env("ADMIN").username);
    cy.get("input#password").type(Cypress.env("ADMIN").password);
    cy.get("[type='submit']").click();

    cy.contains("Pacientes");

    cy.url().should("be.equal", Cypress.env("baseUrl"));
  });
});
