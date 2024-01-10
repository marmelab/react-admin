import * as React from 'react';
import { memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ImageEye from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import {
    RaRecord,
    useResourceContext,
    useRecordContext,
    useCreatePath,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Opens the Show view of a given record
 *
 * @example // basic usage
 * import { ShowButton, useRecordContext } from 'react-admin';
 *
 * const CommentShowButton = () => {
 *     const record = useRecordContext();
 *     return (
 *         <ShowButton label="Show comment" record={record} />
 *     );
 * };
 */
const ShowButton = <RecordType extends RaRecord = any>(
    props: ShowButtonProps<RecordType>
) => {
    const {
        icon = defaultIcon,
        label = 'ra.action.show',
        record: recordProp,
        resource: resourceProp,
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    if (!record) return null;
    return (
        <Button
            component={Link}
            to={createPath({ type: 'show', resource, id: record.id })}
            state={scrollStates[String(scrollToTop)]}
            label={label}
            onClick={stopPropagation}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

// avoids using useMemo to get a constant value for the link state
const scrollStates = {
    true: { _scrollToTop: true },
    false: {},
};

const defaultIcon = <ImageEye />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props<RecordType extends RaRecord = any> {
    icon?: ReactElement;
    label?: string;
    record?: RecordType;
    resource?: string;
    scrollToTop?: boolean;
}

export type ShowButtonProps<RecordType extends RaRecord = any> = Props<
    RecordType
> &
    Omit<ButtonProps<typeof Link>, 'to'>;

ShowButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
    scrollToTop: PropTypes.bool,
};

const PureShowButton = memo(
    ShowButton,
    (prevProps, nextProps) =>
        prevProps.resource === nextProps.resource &&
        (prevProps.record && nextProps.record
            ? prevProps.record.id === nextProps.record.id
            : prevProps.record == nextProps.record) && // eslint-disable-line eqeqeq
        prevProps.label === nextProps.label &&
        prevProps.disabled === nextProps.disabled
);

export default PureShowButton;
