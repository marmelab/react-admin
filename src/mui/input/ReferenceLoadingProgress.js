import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';

import Labeled from './Labeled';

const progessContainerStyle = {
    padding: '2em 0',
    height: 'auto',
};
const progessStyle = {
    width: '16em',
    margin: '1em 0',
};

const ReferenceLoadingProgress = ({ label }) => (
    <Labeled label={label}>
        <span style={progessContainerStyle}>
            <LinearProgress mode="indeterminate" style={progessStyle} />
        </span>
    </Labeled>
);

ReferenceLoadingProgress.propTypes = {
    label: PropTypes.string.isRequired,
};

export default ReferenceLoadingProgress;
