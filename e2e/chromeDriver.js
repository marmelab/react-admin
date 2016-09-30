const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');

const driverPath = path.join(__dirname, '../node_modules/selenium-standalone/.selenium/chromedriver/2.21-x64-chromedriver');
const service = new chrome.ServiceBuilder(driverPath).build();
chrome.setDefaultService(service);

module.exports = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
