/// <reference types="Cypress" />
/* globals cy */

import listPageFactory from '../support/ListPage';
import loginPageFactory from '../support/LoginPage';

describe('Authentication', () => {
    const ListPage = listPageFactory('/#/posts');
    const LoginPage = loginPageFactory('/#/login');

    it('should go to login page after logout', () => {
        ListPage.navigate();
        ListPage.logout();
        cy.url().then(url => expect(url).to.contain('/#/login'));
    });

    it('should redirect to login page when not logged in', () => {
        ListPage.navigate();
        ListPage.logout();
        ListPage.navigate();

        cy.url().then(url => expect(url).to.contain('/#/login'));
    });
    it('should not login with incorrect credentials', () => {
        LoginPage.navigate();
        LoginPage.login('foo', 'bar');
        cy.contains('Authentication failed, please retry');
    });
    it('should login with correct credentials', () => {
        LoginPage.navigate();
        LoginPage.login('login', 'password');
        cy.url().then(url => expect(url).to.contain('/#/posts'));
    });
});
