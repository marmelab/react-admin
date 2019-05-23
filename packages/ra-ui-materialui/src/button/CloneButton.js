import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import Queue from '@material-ui/icons/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string'
import { ComponentPropType } from 'ra-core';

import Button from './Button';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }) => rest;

const sanitizeRestProps = ({
    // the next 6 props are injected by Toolbar
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    saving,
    submitOnEnter,
    ...rest
}) => rest;

export const CloneButton = ({
    basePath = '',
    label = 'ra.action.clone',
    record = {},
    icon: Icon = Queue,
    ...rest
}) => (
    <Button
        component={Link}
        to={{
            pathname: `${basePath}/create`,
            search: stringify(omitId(record)), // FIXME use location state when https://github.com/supasate/connected-react-router/issues/301 is fixed
        }}
        label={label}
        onClick={stopPropagation}
        {...sanitizeRestProps(rest)}
    >
        <Icon />
    </Button>
);

CloneButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    icon: ComponentPropType,
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
