import { cyLogin, cyMockGraphQL, cySetup } from "../support/functions";

describe("train default screen", () => {
  it("displays train default button", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy, "admin")],
    });
    cy.visit("/train_default");
    cy.wait("@login");
  });

  it("hides training if not logged in", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [],
    });
    cy.visit("/train_default");
    cy.contains("Please login to view default model")
  });

  it("hides training if not admin or content manager", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy)],
    });
    cy.visit("/train_default");
    cy.wait("@login");
    cy.contains("You must be an admin or content manager to view this page.")
  });
});
