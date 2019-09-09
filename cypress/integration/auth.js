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
        cy.url().should('contain', '/#/login');
    });
    it('should not login with incorrect credentials', () => {
        ListPage.navigate();
        ListPage.logout();
        LoginPage.login('foo', 'bar');
        cy.contains('Authentication failed, please retry');
    });
    it('should login with correct credentials', () => {
        ListPage.navigate();
        ListPage.logout();
        LoginPage.login('login', 'password');
        cy.url().then(url => expect(url).to.contain('/#/posts'));
    });
});
