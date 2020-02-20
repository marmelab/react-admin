import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import Queue from '@material-ui/icons/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { Record } from 'ra-core';

import Button, { ButtonProps } from './Button';

export const CloneButton: FC<CloneButtonProps> = ({
    basePath = '',
    label = 'ra.action.clone',
    record,
    icon = defaultIcon,
    ...rest
}) => (
    <Button
        component={Link}
        to={
            record
                ? {
                      pathname: `${basePath}/create`,
                      search: stringify({
                          source: JSON.stringify(omitId(record)),
                      }),
                  }
                : `${basePath}/create`
        }
        label={label}
        onClick={stopPropagation}
        {...sanitizeRestProps(rest)}
    >
        {icon}
    </Button>
);

const defaultIcon = <Queue />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }: Record) => rest;

const sanitizeRestProps = ({
    // the next 6 props are injected by Toolbar
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    saving,
    submitOnEnter,
    ...rest
}: any) => rest;

interface Props {
    basePath?: string;
    record?: Record;
    icon?: ReactElement;
}

export type CloneButtonProps = Props & ButtonProps;

CloneButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

const enhance = shouldUpdate(
    (props: Props, nextProps: Props) =>
        (props.record &&
            nextProps.record &&
            props.record !== nextProps.record) ||
        props.basePath !== nextProps.basePath ||
        (props.record == null && nextProps.record != null)
);

export default enhance(CloneButton);
