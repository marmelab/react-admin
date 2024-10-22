import listPageFactory from '../support/ListPage';

describe('Navigation', () => {
    const ListPage = listPageFactory('/#/posts');

    describe('Sidebar', () => {
        it('should have tabbable menu items', () => {
            ListPage.navigate();

            ListPage.waitUntilVisible();
            // We need to wait for 'John Doe' and 'Posts' to be visible, because enabling canAccess triggers
            // additional rerenders, and otherwise it's the 'Skip to content' button that gets focused
            cy.contains('John Doe');
            cy.contains('Posts');
            cy.get(ListPage.elements.profile).focus().tab();

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
