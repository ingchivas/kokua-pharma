describe('test login', () => {
  it('should login', () => {
    cy.visit('http://localhost:3000/', {failOnStatusCode: false});
    // It should redirect us to the login page http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F
    cy.url().should('include', '/sign-in');
    cy.get('#identifier-field').type(Cypress.env('testUser'));
    cy.get('.cl-formButtonPrimary').click();
    cy.get('input[name="password"]').type(Cypress.env('testPassword'));
    cy.get('.cl-formButtonPrimary').click();
    cy.get('h1').should('contain', 'No tienes permiso para ver esta página');
  });
}
);