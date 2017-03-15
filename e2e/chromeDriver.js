const chrome = require('chromedriver');
const webdriver = require('selenium-webdriver');

module.exports = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
