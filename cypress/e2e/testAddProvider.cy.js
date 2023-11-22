describe('test add provider', () => {
    it('add provider to db', () => {
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        // It should redirect us to the login page http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F
        cy.url().should('include', '/sign-in');
        cy.get('#identifier-field').type(Cypress.env('adminUser'));
        cy.get('.cl-formButtonPrimary').click();
        cy.get('input[name="password"]').type(Cypress.env('adminPassword'));
        cy.get('.cl-formButtonPrimary').click();
        cy.get('h1').should('contain', 'Dashboard');
        cy.get('.flex-col > :nth-child(6) > .relative').click();
        cy.get('.tremor-Flex-root > .text-2xl').should('contain', 'Administrar Proveedores');
        cy.get('.MuiButton-outlinedPrimary').click();
        cy.get('#nombre').type('Saint Philippe 150 Pharma S.A. de C.V.');
        cy.get('#ubicacion').type('Mier y Pesado 150, Del Valle, Benito Juárez, 03100 Ciudad de México, CDMX');
        cy.get('#numContacto').type('5534200652');
        cy.get('form > .MuiButtonBase-root').click();
        cy.get('.tremor-Flex-root > .text-2xl').should('contain', 'Administrar Proveedores');
        cy.get('.Toastify__toast-body > :nth-child(2)').should('contain.text', 'Proveedor añadido');
    });
}
);