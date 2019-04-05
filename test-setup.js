require('raf/polyfill');
require('mutationobserver-shim');
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

/**
 * Mock PopperJS
 *
 * When using mount(), material-ui calls Popper.js, which is not compatible with JSDom
 * And causes UnhandledPromiseRejectionWarning: TypeError: document.createRange is not a function
 *
 * @see https://github.com/FezVrasta/popper.js/issues/478
 * */
jest.mock('popper.js', () => {
    class Popper {
        constructor() {
            return {
                destroy: () => {},
                scheduleUpdate: () => {},
            };
        }
    }
    Popper.placements = [
        'auto',
        'auto-end',
        'auto-start',
        'bottom',
        'bottom-end',
        'bottom-start',
        'left',
        'left-end',
        'left-start',
        'right',
        'right-end',
        'right-start',
        'top',
        'top-end',
        'top-start',
    ];
    return Popper;
});
