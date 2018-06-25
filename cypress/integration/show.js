/// <reference types="Cypress" />
/* globals cy */
import showPageFactory from '../support/ShowPage';

describe('Show Page', () => {
    const ShowPage = showPageFactory('/#/posts/10/show');

    it('should fill the page with data from the fetched record', () => {
        ShowPage.navigate();
        cy.contains('Totam vel quasi a odio et nihil');
    });
});
