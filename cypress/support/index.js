import 'cypress-plugin-tab';
import '../e2e/support/resize-observer-mock';

// Make the CI fail if console.error in tests
const originalConsoleError = console.error;
console.error = (...args) => {
    originalConsoleError.call(console, args);
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
jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
    }
    originalConsoleError.call(console, ...args);
});
