import 'chromedriver';
import webdriver from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const options = new Options();

export default new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
