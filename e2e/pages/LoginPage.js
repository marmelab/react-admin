import { By, until } from 'selenium-webdriver';

module.exports = (url) => (driver) => ({
    elements: {
        username: By.css("input[name='username']"),
        password: By.css("input[name='password']"),
        submitButton: By.css('button'),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilVisible();
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.username));
    },

    login(username = 'login', password = 'password') {
        const usernameField = driver.findElement(this.elements.username);
        usernameField.clear();
        usernameField.sendKeys(username);
        const passwordField = driver.findElement(this.elements.password);
        passwordField.clear();
        passwordField.sendKeys(password);
        const submitButton = driver.findElement(this.elements.submitButton);
        return submitButton.click();
    },
});
