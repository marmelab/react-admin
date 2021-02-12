import * as React from 'react';
import { FC, ReactElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import ContentCreate from '@material-ui/icons/Create';
import { ButtonProps as MuiButtonProps } from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { linkToRecord, Record } from 'ra-core';

import Button, { ButtonProps } from './Button';

const EditButton: FC<EditButtonProps> = ({
    basePath = '',
    label = 'ra.action.edit',
    record,
    icon = defaultIcon,
    scrollToTop = true,
    ...rest
}) => (
    <Button
        component={Link}
        to={useMemo(
            () => ({
                pathname: record ? linkToRecord(basePath, record.id) : '',
                state: { _scrollToTop: scrollToTop },
            }),
            [basePath, record, scrollToTop]
        )}
        label={label}
        onClick={stopPropagation}
        {...(rest as any)}
    >
        {icon}
    </Button>
);

const defaultIcon = <ContentCreate />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props {
    basePath?: string;
    record?: Record;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type EditButtonProps = Props & ButtonProps & MuiButtonProps;

EditButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

export default EditButton;
