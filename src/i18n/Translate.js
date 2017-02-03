import { PropTypes } from 'react';
import { getContext } from 'recompose';

const translate = getContext({
    translate: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
});

export default translate;
