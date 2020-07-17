describe("lessons screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/grading-api/graphql",
      status: 200,
      response: {
        data: {
          lessons: {
            edges: [
              {
                node: {
                  lessonId: "lesson1",
                  name: "lesson 1",
                },
              },
              {
                node: {
                  lessonId: "lesson2",
                  name: "lesson 2",
                },
              },
            ],
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("displays a table with headers Lesson", () => {
    cy.visit("/lessons");
    const tableHead = cy.get("table thead tr");
    tableHead.get("th").eq(0).should("contain", "Lesson");
  });

  it("displays 2 lesson names by row", () => {
    cy.visit("/lessons");
    const tableBody = cy.get("table tbody");
    tableBody.get("tr").should("have.length", 2);
    cy.get("table>tbody>tr:nth-child(1)>td:nth-child(1)").should(
      "contain",
      "lesson 1"
    );
    cy.get("table>tbody>tr:nth-child(2)>td:nth-child(1)").should(
      "contain",
      "lesson 2"
    );
  });

  it("opens eddit for a lesson on tap link", () => {
    cy.visit("/lessons");
    cy.get("#lesson-name-0 a").click();
    cy.get("#header").should("contain", "Edit");
  });

  it("clicks on create lesson and oppens to an edit page for the lesson", () => {
    cy.visit("/lessons");
    cy.get("#create-button").click();
    cy.get("#header").should("contain", "Edit");
  });
});