import { until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import listPageFactory from '../pages/ListPage';
import loginPageFactory from '../pages/LoginPage';

describe('Authentication', () => {
    const ListPage = listPageFactory('http://localhost:8083/#/posts')(driver);
    const LoginPage = loginPageFactory('http://localhost:8083/#/login')(driver);
    it('should go to login page after logout', async () => {
        await ListPage.navigate();
        await ListPage.logout();
        return driver.wait(
            until.urlIs('http://localhost:8083/#/login'),
            2000,
            'Redirection to login did not happen'
        );
    });
    it('should redirect to login page when not logged in', async () => {
        await ListPage.navigate();
        return driver.wait(
            until.urlIs('http://localhost:8083/#/login'),
            2000,
            'Redirection to login did not happen'
        );
    });
    it('should not login with incorrect credentials', async () => {
        await LoginPage.navigate();
        await LoginPage.login('foo', 'bar');
        return driver.wait(
            until.urlIs('http://localhost:8083/#/login'),
            2000,
            'Redirection to login did not happen'
        );
    });
    it('should login with correct credentials', async () => {
        await LoginPage.navigate();
        await LoginPage.login('login', 'password');
        return driver.wait(until.urlIs('http://localhost:8083/#/posts'));
    });
});
