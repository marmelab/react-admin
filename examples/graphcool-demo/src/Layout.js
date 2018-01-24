import { connect } from 'react-redux';
import { Layout } from 'react-admin';

const darkTheme = {
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
};

export default connect(
    state => ({
        theme: state.theme === 'dark' ? darkTheme : {},
    }),
    {} // Avoid connect passing dispatch in props
)(Layout);
