import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'ra-core';
import { get } from 'lodash';

import Button from './Button';

const ShowButton = ({
    basePath = '',
    label = 'ra.action.show',
    record = {},
    source = 'id',
    ...rest
}) => (
    <Button
        component={Link}
        to={`${linkToRecord(basePath, get(record, source))}/show`}
        label={label}
        {...rest}
    >
        <ImageEye />
    </Button>
);

ShowButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string,
};

const enhance = shouldUpdate(
    (props, nextProps) =>
        props.translate !== nextProps.translate ||
        (props.record &&
            nextProps.record &&
            props.record.id !== nextProps.record.id) ||
        props.basePath !== nextProps.basePath ||
        (props.record == null && nextProps.record != null)
);

export default enhance(ShowButton);
