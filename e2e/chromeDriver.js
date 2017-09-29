import 'chromedriver';
import webdriver from 'selenium-webdriver';

export default new webdriver.Builder().forBrowser('chrome').build();
