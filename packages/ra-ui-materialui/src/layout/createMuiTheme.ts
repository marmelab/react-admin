import {
    createTheme as createLegacyModeTheme,
    unstable_createMuiStrictModeTheme as createStrictModeTheme,
} from '@material-ui/core/styles';

/**
 * Alternative to MUI's createMuiTheme that doesn't log findDomNode warnings in StrictMode
 *
 * @see https://github.com/mui-org/material-ui/issues/13394
 */
export const createMuiTheme =
    process.env.NODE_ENV === 'production'
        ? createLegacyModeTheme
        : createStrictModeTheme;
