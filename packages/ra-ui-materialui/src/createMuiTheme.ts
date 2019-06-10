import { createMuiTheme as baseCreateMuiTheme } from '@material-ui/core/styles';
import merge from 'lodash/merge';
import defaultTheme from './defaultTheme';

const createMuiTheme = customTheme => {
    const theme = merge({}, defaultTheme, customTheme);
    return baseCreateMuiTheme(theme);
};

export default createMuiTheme;

