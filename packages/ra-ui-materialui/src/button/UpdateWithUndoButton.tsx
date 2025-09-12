import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ActionUpdate from '@mui/icons-material/Update';
import {
    useResourceContext,
    type RaRecord,
    useRecordContext,
    useTranslate,
    useGetRecordRepresentation,
    useResourceTranslation,
    useUpdateController,
    UseUpdateControllerParams,
} from 'ra-core';
import { humanize, singularize } from 'inflection';

import { Button, type ButtonProps } from './Button';

export const UpdateWithUndoButton = (inProps: UpdateWithUndoButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const record = useRecordContext(props);
    const resource = useResourceContext(props);

    const {
        data,
        label: labelProp,
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const { handleUpdate, isPending } = useUpdateController(rest);
    const translate = useTranslate();
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    let recordRepresentation = getRecordRepresentation(record);
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 1,
        _: humanize(
            translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: resource ? singularize(resource) : undefined,
            }),
            true
        ),
    });
    // We don't support React elements for this
    if (React.isValidElement(recordRepresentation)) {
        recordRepresentation = `#${record?.id}`;
    }
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.update`,
        baseI18nKey: 'ra.action.update',
        options: {
            name: resourceName,
            recordRepresentation,
        },
        userText: labelProp,
    });

    const handleClick = e => {
        if (!record) {
            throw new Error(
                'The UpdateWithUndoButton must be used inside a RecordContext.Provider or must be passed a record prop.'
            );
        }
        handleUpdate(data);
        if (typeof onClick === 'function') {
            onClick(e);
        }
        e.stopPropagation();
    };

    return (
        <StyledButton
            onClick={handleClick}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
            disabled={isPending}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionUpdate />;

const sanitizeRestProps = ({
    label,
    mutationOptions,
    ...rest
}: Omit<UpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface UpdateWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps,
        Omit<
            UseUpdateControllerParams<RecordType, MutationOptionsError>,
            'mutationMode'
        > {
    icon?: React.ReactNode;
    data: any;
}

const PREFIX = 'RaUpdateWithUndoButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: (theme.vars || theme).palette.primary.main,
    '&:hover': {
        backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.primary.main}, transparent 12%)`,
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaUpdateWithUndoButton: 'root';
    }

    interface ComponentsPropsList {
        RaUpdateWithUndoButton: Partial<UpdateWithUndoButtonProps>;
    }

    interface Components {
        RaUpdateWithUndoButton?: {
            defaultProps?: ComponentsPropsList['RaUpdateWithUndoButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaUpdateWithUndoButton'];
        };
    }
}
