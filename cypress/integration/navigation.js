import listPageFactory from '../support/ListPage';

describe('Navigation', () => {
    const ListPage = listPageFactory('/#/posts');

    describe('Sidebar', () => {
        it('should have tabbable menu items', () => {
            ListPage.navigate();

            ListPage.waitUntilVisible();
            // Wait for initial data loading of the list to finish
            ListPage.waitUntilDataLoaded().should('be.visible');
            ListPage.waitUntilDataLoaded().should('not.be.visible');
            // Wait for references data loading of the list to finish
            ListPage.waitUntilDataLoaded().should('be.visible');
            ListPage.waitUntilDataLoaded().should('not.be.visible');

            cy.get('body').tab().tab().tab().tab().tab();

            cy.get(`${ListPage.elements.menuItems}:first-child`).should(
                'have.class',
                'Mui-focusVisible'
            );
        });
    });

    describe('Skip Navigation Button', () => {
        it('should appear when a user immediately tabs on the homepage', () => {
            ListPage.navigate();

            ListPage.waitUntilVisible();

            cy.get('body').tab();

            cy.get(ListPage.elements.skipNavButton).should('exist');
        });
    });
});
