import listPageFactory from '../support/ListPage';

describe('Mobile UI', () => {
    const ListPagePosts = listPageFactory('/#/posts');

    beforeEach(() => {
        window.localStorage.clear();
        cy.viewport('iphone-x');
    });

    describe('Infinite Scroll', () => {
        it('should load more items when scrolling to the bottom of the page', () => {
            ListPagePosts.navigate();
            cy.contains('Sint dignissimos in architecto aut');
            cy.contains('Fusce massa lorem').should('exist');
            cy.contains('Sed quo et et fugiat modi').should('not.exist');
            cy.wait(500);
            cy.contains('Sint dignissimos in architecto aut').scrollIntoView();
            cy.contains('Sed quo et et fugiat modi');
        });
    });
});
