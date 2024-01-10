import * as React from 'react';
import { memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Queue from '@mui/icons-material/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { useResourceContext, useRecordContext, useCreatePath } from 'ra-core';

import { Button, ButtonProps } from './Button';

export const CloneButton = (props: CloneButtonProps) => {
    const {
        label = 'ra.action.clone',
        scrollToTop = true,
        icon = defaultIcon,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    const pathname = createPath({ resource, type: 'create' });
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
                      }
                    : pathname
            }
            state={{ _scrollToTop: scrollToTop }}
            label={label}
            onClick={stopPropagation}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <Queue />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const omitId = ({ id, ...rest }: any) => rest;

const sanitizeRestProps = ({
    resource,
    record,
    ...rest
}: Omit<CloneButtonProps, 'label' | 'scrollToTop' | 'icon'>) => rest;

interface Props {
    record?: any;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type CloneButtonProps = Props & Omit<ButtonProps<typeof Link>, 'to'>;

CloneButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

export default memo(CloneButton);
