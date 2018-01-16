import 'chromedriver';
import webdriver from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const options = new Options();
options.addArguments('--start-maximized');

export default new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
