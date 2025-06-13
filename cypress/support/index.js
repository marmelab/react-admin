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
