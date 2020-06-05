import * as React from 'react';
import { FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
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
        {...rest}
    >
        {icon}
    </Button>
);

const defaultIcon = <Queue />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }: Record) => rest;

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

export default memo(CloneButton);
