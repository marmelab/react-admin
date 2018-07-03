import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ContentCreate from '@material-ui/icons/Create';

import Link from '../Link';
import Button from './Button';

const omitId = ({ id, ...rest }) => rest;

export const CloneButton = ({
    basePath = '',
    label = 'ra.action.clone',
    record = {},
    ...rest
}) => (
    <Button
        component={Link}
        to={{
            pathname: `${basePath}/create`,
            state: { record: omitId(record) },
        }}
        label={label}
        {...rest}
    >
        <ContentCreate />
    </Button>
);

CloneButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
};

const enhance = shouldUpdate(
    (props, nextProps) =>
        props.translate !== nextProps.translate ||
        (props.record &&
            nextProps.record &&
            props.record !== nextProps.record) ||
        props.basePath !== nextProps.basePath ||
        (props.record == null && nextProps.record != null)
);

export default enhance(CloneButton);
