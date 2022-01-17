import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ContentCreate from '@mui/icons-material/Create';
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { Link } from 'react-router-dom';
import {
    RaRecord,
    useResourceContext,
    useRecordContext,
    useCreateInternalLink,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Opens the Edit view for the current record.
 *
 * Reads the record and resource from the context.
 *
 * @example // basic usage
 * import { EditButton } from 'react-admin';
 *
 * const CommentEditButton = () => (
 *     <EditButton label="Edit comment" />
 * );
 */
export const EditButton = (props: EditButtonProps) => {
    const {
        icon = defaultIcon,
        label = 'ra.action.edit',
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const createInternalLink = useCreateInternalLink();
    if (!record) return null;
    return (
        <Button
            component={Link}
            to={createInternalLink({ type: 'edit', resource, id: record.id })}
            state={{ _scrollToTop: scrollToTop }}
            label={label}
            onClick={stopPropagation}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ContentCreate />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props {
    icon?: ReactElement;
    label?: string;
    record?: RaRecord;
    scrollToTop?: boolean;
}

export type EditButtonProps = Props & ButtonProps & MuiButtonProps;

EditButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
    scrollToTop: PropTypes.bool,
};
