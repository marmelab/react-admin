import listPageFactory from '../support/ListPage';

describe('Mobile UI', () => {
    const ListPagePosts = listPageFactory('/#/posts');

    beforeEach(() => {
        window.localStorage.clear();
        cy.viewport('iphone-x');
    });

    describe('Infinite Scroll', () => {
        it.only('should load more items when scrolling to the bottom of the page', () => {
            ListPagePosts.navigate();
            cy.contains('Sed quo et et fugiat modi').should('not.exist');
            cy.scrollTo('bottom');
            cy.wait(500);
            cy.scrollTo('bottom');
            cy.contains('Sed quo et et fugiat modi');
        });
    });
});
