import * as React from 'react';
import { memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Queue from '@material-ui/icons/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { Record, useResourceContext } from 'ra-core';

import Button, { ButtonProps } from './Button';

export const CloneButton = (props: CloneButtonProps) => {
    const {
        basePath = '',
        label = 'ra.action.clone',
        scrollToTop = true,
        record,
        icon = defaultIcon,
        ...rest
    } = props;

    const resource = useResourceContext();
    const pathname = basePath ? `${basePath}/create` : `/${resource}/create`;
    return (
        <Button
            component={Link}
            to={
                record
                    ? {
                          pathname,
                          search: stringify({
                              source: JSON.stringify(omitId(record)),
                          }),
                          state: { _scrollToTop: scrollToTop },
                      }
                    : pathname
            }
            label={label}
            onClick={stopPropagation}
            {...rest}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <Queue />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }: Record) => rest;

interface Props {
    basePath?: string;
    record?: Record;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type CloneButtonProps = Props & ButtonProps;

CloneButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

export default memo(CloneButton);
