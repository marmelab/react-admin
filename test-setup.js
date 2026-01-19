// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

// Make the CI fail if console.error in tests
let error = console.error;
console.error = (...args) => {
    error.call(console, args);
    throw new Error(
        JSON.stringify({
            message: 'The tests failed due to `console.error` calls',
            error: args,
        })
    );
};

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

/** Mock scrollTo as it is not supported by JSDOM */
global.scrollTo = jest.fn();

const { configure: configureReact } = require('@testing-library/react');

configureReact({ asyncUtilTimeout: 15000 });
