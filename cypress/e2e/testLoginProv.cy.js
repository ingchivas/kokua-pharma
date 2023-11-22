describe('test login', () => {
  it('should login', () => {
    cy.visit('http://localhost:3000/', { failOnStatusCode: false });
    // It should redirect us to the login page http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F
    cy.url().should('include', '/sign-in');
    cy.get('#identifier-field').type(Cypress.env('providerUser'));
    cy.get('.cl-formButtonPrimary').click();
    cy.get('input[name="password"]').type(Cypress.env('providerPassword'));
    cy.get('.cl-formButtonPrimary').click();
    cy.url().should('include', '/proveedores');
    cy.get('h1').should('contain', 'Bienvenido, proveedor: Drugmex, S.A.P.I. de C.V.');
  });
}
);