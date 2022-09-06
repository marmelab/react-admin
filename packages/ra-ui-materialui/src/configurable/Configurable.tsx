import * as React from 'react';
import { ReactNode } from 'react';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { InspectorButton } from './InspectorButton';
import { usePreferencesEditor } from 'ra-core';

export const Configurable = (props: ConfigurableProps) => {
    const { children, elementRef, editor, openButtonLabel } = props;

    const {
        isEnabled,
        setEditor,
        editor: currentEditor,
    } = usePreferencesEditor();

    const handleOpenEditor = () => {
        setEditor(editor);
    };

    const rect = elementRef?.current?.getBoundingClientRect();

    return (
        <Root
            className={clsx(
                isEnabled && ConfigurableClasses.editMode,
                editor === currentEditor && ConfigurableClasses.editorActive
            )}
        >
            {children}
            <InspectorButton
                onClick={handleOpenEditor}
                label={openButtonLabel}
                size="small"
                color="primary"
                className={ConfigurableClasses.button}
                sx={{
                    left: rect?.right - 30,
                    top: rect?.top,
                }}
            />
        </Root>
    );
};

export interface ConfigurableProps {
    children: ReactNode;
    elementRef: React.RefObject<HTMLElement>;
    editor: ReactNode;
    openButtonLabel: string;
}

const PREFIX = 'RaConfigurable';

export const ConfigurableClasses = {
    editMode: `${PREFIX}-editMode`,
    button: `${PREFIX}-button`,
    editorActive: `${PREFIX}-editorActive`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ConfigurableClasses.button}`]: {
        display: 'none',
    },
    [`&.${ConfigurableClasses.editMode}:hover > .${ConfigurableClasses.button}`]: {
        display: 'block',
        position: 'absolute',
        zIndex: theme.zIndex.modal - 1,
    },
    [`&.${ConfigurableClasses.editMode} > *:first-child`]: {
        transition: theme.transitions.create('box-shadow'),
        boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${alpha(
            theme.palette.primary.main,
            0.3
        )} 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
    },
    [`&.${ConfigurableClasses.editMode}:hover > *:first-child`]: {
        boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${alpha(
            theme.palette.primary.main,
            0.3
        )} 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
    },

    [`&.${ConfigurableClasses.editorActive} > *:first-child, &.${ConfigurableClasses.editorActive}:hover > *:first-child`]: {
        boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${theme.palette.primary.main} 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
    },
}));
