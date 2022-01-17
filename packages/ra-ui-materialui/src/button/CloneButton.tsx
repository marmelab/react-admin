import * as React from 'react';
import { memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Queue from '@mui/icons-material/Queue';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { RaRecord, useResourceContext, useCreateInternalLink } from 'ra-core';

import { Button, ButtonProps } from './Button';

export const CloneButton = (props: CloneButtonProps) => {
    const {
        label = 'ra.action.clone',
        scrollToTop = true,
        record,
        icon = defaultIcon,
        ...rest
    } = props;

    const resource = useResourceContext(props);
    const createInternalLink = useCreateInternalLink();
    const pathname = createInternalLink({ resource, type: 'create' });
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

const omitId = ({ id, ...rest }: RaRecord) => rest;

interface Props {
    record?: RaRecord;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type CloneButtonProps = Props & ButtonProps;

CloneButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
};

export default memo(CloneButton);
