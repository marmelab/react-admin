import 'chromedriver';
import webdriver from 'selenium-webdriver';

module.exports = new webdriver.Builder().forBrowser('chrome').build();
