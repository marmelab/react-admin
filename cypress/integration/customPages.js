/// <reference types="Cypress" />
/* globals cy */
import customPageFactory from '../support/CustomPage';

describe('Custom Pages', () => {
    const CustomPageNoLayout = customPageFactory('/#/custom');

    const CustomPageWithLayout = customPageFactory('/#/custom2');

    describe('Without Layout', () => {
        it('should not display the layout', () => {
            CustomPageNoLayout.navigate();
            cy.contains('Example Admin').should(el => expect(el).to.not.exist);
        });

        it('should have retrieved the number of posts', () => {
            CustomPageNoLayout.navigate();
            cy.contains('Found 13 posts !');
        });
    });
    describe('With Layout', () => {
        it('should display the layout', () => {
            CustomPageWithLayout.navigate();
            cy.contains('Example Admin');
        });

        it('should have retrieved the number of posts', () => {
            CustomPageWithLayout.navigate();
            cy.contains('Found 13 posts !');
        });
    });
});
