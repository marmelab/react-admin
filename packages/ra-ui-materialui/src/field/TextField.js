import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';

const TextField = ({ className, source, record = {}, ...rest }) => {
    const value = get(record, source);
    return (
        <Typography
            component="span"
            body1="body1"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {value && typeof value !== 'string' ? JSON.stringify(value) : value}
        </Typography>
    );
};

TextField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
};

// wat? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';
const PureTextField = pure(TextField);

PureTextField.defaultProps = {
    addLabel: true,
};

export default PureTextField;
