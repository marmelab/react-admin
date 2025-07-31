import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
    fixturesFolder: 'fixtures',
    screenshotsFolder: 'screenshots',
    videosFolder: 'videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    blockHosts: ['source.unsplash.com'],
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on) {
            on('before:browser:launch', (browser = {}, launchOptions) => {
                // Fix for Cypress 4:
                // https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage
                if (browser.name === 'chrome') {
                    launchOptions.args.push(
                        '--disable-blink-features=RootLayerScrolling'
                    );
                    launchOptions.args.push('--disable-gpu');
                    launchOptions.args.push('--proxy-bypass-list=<-loopback>');
                    return launchOptions;
                }
            });
            on('file:preprocessor', vitePreprocessor());
        },
        baseUrl: 'http://localhost:8080',
        specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'support/index.js',
    },
});
