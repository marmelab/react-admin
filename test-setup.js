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
// TextEncoder isn't bundled with JsDom, see https://stackoverflow.com/a/68468204/1333479
const { TextEncoder, TextDecoder } = require('util');

global.Response = Response;
global.Headers = Headers;
global.Request = Request;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
