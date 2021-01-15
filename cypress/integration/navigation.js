import listPageFactory from '../support/ListPage';

describe('Navigation', () => {
    const ListPage = listPageFactory('/#/posts');

    describe('Sidebar', () => {
        it('should have tabbable menu items', () => {
            ListPage.navigate();

            ListPage.waitUntilVisible();

            cy.get('body').tab().tab().tab();

            cy.get(`${ListPage.elements.menuItems}:first-child`).should(
                'have.class',
                'Mui-focusVisible'
            );
        });
    });
});
