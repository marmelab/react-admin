import assert from 'assert';
import driver from '../chromeDriver';
import listPageFactory from '../pages/ListPage';
import loginPageFactory from '../pages/LoginPage';

describe('Authentication', () => {
    const ListPage = listPageFactory('http://localhost:8083/#/posts')(driver);
    const LoginPage = loginPageFactory('http://localhost:8083/#/login')(driver);
    it('should go to login page after logout', async () => {
        await ListPage.navigate();
        await ListPage.logout();
        await driver.sleep(300);
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/login');
    });
    it('should redirect to login page when not logged in', async () => {
        await ListPage.navigate();
        await driver.sleep(300);
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/login');
    });
    it('should not login with incorrect credentials', async () => {
        await LoginPage.navigate();
        await LoginPage.login('foo', 'bar');
        await driver.sleep(300);
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/login');
    });
    it('should login with correct credentials', async () => {
        await LoginPage.navigate();
        await LoginPage.login('login', 'password');
        await driver.sleep(300);
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/posts');
    });
});
