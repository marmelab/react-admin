import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'ra-core';

import Button from './Button';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const ShowButton = ({ basePath = '', label = 'ra.action.show', record = {}, icon = <ImageEye />, ...rest }) => (
    <Button
        component={Link}
        to={`${linkToRecord(basePath, record.id)}/show`}
        label={label}
        onClick={stopPropagation}
        {...rest}
    >
        {icon}
    </Button>
);

ShowButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    icon: PropTypes.element,
};

const enhance = shouldUpdate(
    (props, nextProps) =>
        props.translate !== nextProps.translate ||
        (props.record && nextProps.record && props.record.id !== nextProps.record.id) ||
        props.basePath !== nextProps.basePath ||
        (props.record == null && nextProps.record != null)
);

export default enhance(ShowButton);
