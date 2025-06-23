import * as React from 'react';
import { memo } from 'react';
import ImageEye from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import {
    type RaRecord,
    useResourceContext,
    useRecordContext,
    useCreatePath,
    useCanAccess,
    useGetResourceLabel,
    useGetRecordRepresentation,
    useResourceTranslation,
} from 'ra-core';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

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
    inProps: ShowButtonProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

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
    const getResourceLabel = useGetResourceLabel();
    const getRecordRepresentation = useGetRecordRepresentation();
    const recordRepresentationValue = getRecordRepresentation(record);

    const recordRepresentation =
        typeof recordRepresentationValue === 'string'
            ? recordRepresentationValue
            : recordRepresentationValue?.toString();
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.show`,
        baseI18nKey: 'ra.action.show',
        options: {
            name: getResourceLabel(resource, 1),
            recordRepresentation,
        },
        userText: labelProp,
    });

    if (!record || !canAccess || isPending) return null;

    return (
        <StyledButton
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
        </StyledButton>
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

const PREFIX = 'RaShowButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<ShowButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
