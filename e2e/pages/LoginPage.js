import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        username: By.css("input[name='username']"),
        password: By.css("input[name='password']"),
        submitButton: By.css('button'),
    },

    navigate() {
        driver.navigate().to(url);
        this.waitUntilVisible();
        return driver.sleep(250);
    },

    waitUntilVisible() {
        driver
            .wait(until.elementLocated(this.elements.username))
            .then(element => driver.wait(until.elementIsEnabled(element)));
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
