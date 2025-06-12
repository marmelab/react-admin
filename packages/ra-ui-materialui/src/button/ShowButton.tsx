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
        label = 'ra.action.show',
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
    if (!record || !canAccess || isPending) return null;
    return (
        <StyledButton
            component={Link}
            to={createPath({ type: 'show', resource, id: record.id })}
            state={scrollStates[String(scrollToTop)]}
            label={label}
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
