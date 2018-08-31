import listPageFactory from '../support/ListPage';

describe('Edit Page', () => {
    const ListCommentPage = listPageFactory('/#/comments');

    it('should handle successful custom FETCH actions', () => {
        ListCommentPage.navigate();

        // Check the first comment status
        cy.get(ListCommentPage.elements.commentStatus(1)).should(el =>
            expect(el.text()).to.contains('rejected')
        );
        // Click on the first comment approve button
        cy.get(ListCommentPage.elements.commentApproveButton(1)).click();

        // Check the first comment status
        cy.get(ListCommentPage.elements.commentStatus(1)).should(el =>
            expect(el.text()).to.contains('approved')
        );
    });

    it('should handle failed custom FETCH actions', () => {
        ListCommentPage.navigate();

        // Check the second comment status
        cy.get(ListCommentPage.elements.commentStatus(2)).should(el =>
            expect(el.text()).to.contains('approved')
        );
        // Click on the second comment reject button
        cy.get(ListCommentPage.elements.commentRejectButton(2)).click();

        // Check the second comment status optimistic update
        cy.get(ListCommentPage.elements.commentStatus(2)).should(el =>
            expect(el.text()).to.contains('rejected')
        );

        // Check the second comment status undo
        cy.get(ListCommentPage.elements.commentStatus(2), {
            timeout: 10000, // Increase the timeout to wait for the API response
        }).should(el => expect(el.text()).to.contains('approved'));
    });
});
