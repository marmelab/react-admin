import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import { linkToRecord, Record } from 'ra-core';

import Button, { ButtonProps } from './Button';

const ShowButton: FC<ShowButtonProps> = ({
    basePath = '',
    label = 'ra.action.show',
    record,
    icon = defaultIcon,
    ...rest
}) => (
    <Button
        component={Link}
        to={`${linkToRecord(basePath, record && record.id)}/show`}
        label={label}
        onClick={stopPropagation}
        {...rest as any}
    >
        {icon}
    </Button>
);

const defaultIcon = <ImageEye />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props {
    basePath?: string;
    record?: Record;
    icon?: ReactElement;
}

export type ShowButtonProps = Props & ButtonProps;

ShowButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

const enhance = shouldUpdate(
    (props: Props, nextProps: Props) =>
        (props.record &&
            nextProps.record &&
            props.record.id !== nextProps.record.id) ||
        props.basePath !== nextProps.basePath ||
        (props.record == null && nextProps.record != null)
);

export default enhance(ShowButton);
