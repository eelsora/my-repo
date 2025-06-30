/// <reference types="cypress" />
import searchResults from "../fixtures/search-result.json";

describe("weather application", () => {
  // 타이틀 검색
  it("displays the application title", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Weather Application");
  });

  it("search for a city", () => {
    cy.visit("http://localhost:5173/");

    cy.get('[data-testid="search-input"]').type("Melbourne");
    cy.get('[data-testid="search-input"]').type("{enter}");

    cy.intercept("GET", "https://api.openweathermap.org/geo/1.0/direct?q=*", {
      statusCode: 200,
      body: searchResults,
    });

    cy.get('[data-testid="search-results"] .search-result').should(
      "have.length",
      5
    );
  });
});
