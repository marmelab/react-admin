import * as React from 'react';
import { memo } from 'react';
import ImageEye from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import {
    RaRecord,
    useResourceContext,
    useRecordContext,
    useCreatePath,
    useCanAccess,
    useTranslate,
    useGetResourceLabel,
    useGetRecordRepresentation,
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
        label: labelProp,
        record: recordProp,
        resource: resourceProp,
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<ShowButton> components should be used inside a <Resource> component or provided the resource prop.'
        );
    }
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    const { canAccess, isPending } = useCanAccess({
        action: 'show',
        resource,
        record,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const getRecordRepresentation = useGetRecordRepresentation();
    const recordRepresentationValue = getRecordRepresentation(record);

    if (!record || !canAccess || isPending) return null;

    const recordRepresentation =
        typeof recordRepresentationValue === 'string'
            ? recordRepresentationValue
            : recordRepresentationValue?.toString();
    const label =
        labelProp ??
        translate(`resources.${resource}.action.show`, {
            recordRepresentation,
            _: translate(`ra.action.show`, {
                name: getResourceLabel(resource, 1),
                recordRepresentation,
            }),
        });

    return (
        <Button
            component={Link}
            to={createPath({ type: 'show', resource, id: record.id })}
            state={scrollStates[String(scrollToTop)]}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
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
    icon?: React.ReactNode;
    label?: string;
    record?: RecordType;
    resource?: string;
    scrollToTop?: boolean;
}

export type ShowButtonProps<RecordType extends RaRecord = any> =
    Props<RecordType> & Omit<ButtonProps<typeof Link>, 'to'>;

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
