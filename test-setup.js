require('raf/polyfill');

/**
 * As jsDom do not support mutationobserver and
 * quill requires mutationobserver, thus a shim is needed
 */
require('mutationobserver-shim');

/**
 * Mock PopperJS
 *
 * When using mount(), material-ui calls Popper.js, which is not compatible with JSDom
 * And causes UnhandledPromiseRejectionWarning: TypeError: document.createRange is not a function
 *
 * @see https://github.com/FezVrasta/popper.js/issues/478
 */
jest.mock('@popperjs/core', () => {
    const PopperJS = jest.requireActual('@popperjs/core');
    return {
        placements: PopperJS.placements,
        destroy: () => {},
        scheduleUpdate: () => {},
        render: function (this) {
            return this.$options._renderChildren;
        },
    };
});

// Ignore warnings about act()
// See https://github.com/testing-library/react-testing-library/issues/281,
// https://github.com/facebook/react/issues/14769
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
    }
    originalError.call(console, ...args);
});

/**
 * Mock fetch objects Response, Request and Headers
 */
const { Response, Headers, Request } = require('whatwg-fetch');

global.Response = Response;
global.Headers = Headers;
global.Request = Request;
