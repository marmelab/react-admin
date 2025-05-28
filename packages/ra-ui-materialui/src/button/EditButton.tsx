import * as React from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ContentCreate from '@mui/icons-material/Create';
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
export const EditButton = <RecordType extends RaRecord = any>(
    inProps: EditButtonProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        icon = defaultIcon,
        label: labelProp,
        scrollToTop = true,
        className,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<EditButton> components should be used inside a <Resource> component or provided with a resource prop. (The <Resource> component set the resource prop for all its children).'
        );
    }
    const record = useRecordContext(props);
    const createPath = useCreatePath();
    const { canAccess, isPending } = useCanAccess({
        action: 'edit',
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
        resourceI18nKey: `resources.${resource}.action.edit`,
        baseI18nKey: 'ra.action.edit',
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
            to={createPath({ type: 'edit', resource, id: record.id })}
            state={scrollStates[String(scrollToTop)]}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
            onClick={stopPropagation}
            className={clsx(EditButtonClasses.root, className)}
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

const defaultIcon = <ContentCreate />;

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

interface Props<RecordType extends RaRecord = any> {
    icon?: ReactNode;
    label?: string;
    record?: RecordType;
    resource?: string;
    scrollToTop?: boolean;
}

export type EditButtonProps<RecordType extends RaRecord = any> =
    Props<RecordType> & ButtonProps;

const PREFIX = 'RaEditButton';

export const EditButtonClasses = {
    root: `${PREFIX}-root`,
};

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaEditButton: 'root';
    }

    interface ComponentsPropsList {
        RaEditButton: Partial<EditButtonProps>;
    }

    interface Components {
        RaEditButton?: {
            defaultProps?: ComponentsPropsList['RaEditButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaEditButton'];
        };
    }
}
