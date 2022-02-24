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
 * import { ShowButton } from 'react-admin';
 *
 * const CommentShowButton = ({ record }) => (
 *     <ShowButton label="Show comment" record={record} />
 * );
 */
const ShowButton = (props: ShowButtonProps) => {
    const {
        icon = defaultIcon,
        label = 'ra.action.show',
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

interface Props {
    icon?: ReactElement;
    label?: string;
    record?: RaRecord;
    scrollToTop?: boolean;
}

export type ShowButtonProps = Props & ButtonProps;

ShowButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    record: PropTypes.any,
    scrollToTop: PropTypes.bool,
};

const PureShowButton = memo(
    ShowButton,
    (props: ShowButtonProps, nextProps: ShowButtonProps) =>
        props.resource === nextProps.resource &&
        (props.record && nextProps.record
            ? props.record.id === nextProps.record.id
            : props.record == nextProps.record) && // eslint-disable-line eqeqeq
        props.label === nextProps.label &&
        props.disabled === nextProps.disabled
);

export default PureShowButton;
