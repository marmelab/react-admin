import * as React from 'react';
import { useRef, useEffect, useState, cloneElement, ReactElement } from 'react';
import {
    usePreferencesEditor,
    PreferenceKeyContextProvider,
    useTranslate,
} from 'ra-core';
import { alpha, Popover } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import clsx from 'clsx';

/**
 * Wrap any component with this component to make it configurable
 *
 * When the edit mode is enabled, users will see a button to edit the component;
 * when clicked, the inspector will show the editor element.
 *
 * Creates a context for the preference key, so that both the child component
 * and the editor can access it using usePreferenceKey();
 *
 * @example
 * const ConfigurableTextBlock = ({ preferenceKey = "TextBlock", ...props }) => (
 *     <Configurable editor={<TextBlockInspector />} preferenceKey={preferenceKey}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 */
export const Configurable = (props: ConfigurableProps) => {
    const {
        children,
        editor,
        preferenceKey,
        openButtonLabel = 'ra.configurable.customize',
        sx,
    } = props;

    const prefixedPreferenceKey = `preferences.${preferenceKey}`;
    const preferencesEditorContext = usePreferencesEditor();
    const hasPreferencesEditorContext = !!preferencesEditorContext;

    const translate = useTranslate();

    const {
        isEnabled,
        setEditor,
        preferenceKey: currentPreferenceKey,
        setPreferenceKey,
    } = preferencesEditorContext || {};

    const isEditorOpen = prefixedPreferenceKey === currentPreferenceKey;
    const editorOpenRef = useRef(isEditorOpen);
    const wrapperRef = useRef(null);
    const [isCustomizeButtonVisible, setIsCustomizeButtonVisible] = useState(
        false
    );

    useEffect(() => {
        editorOpenRef.current = isEditorOpen;
    }, [isEditorOpen]);

    // on unmount, if selected, remove the editor
    useEffect(() => {
        return () => {
            if (!editorOpenRef.current) return;
            setPreferenceKey && setPreferenceKey(null);
            setEditor && setEditor(null);
        };
    }, [setEditor, setPreferenceKey]);

    if (!hasPreferencesEditorContext) {
        return children;
    }

    const handleOpenEditor = () => {
        // include the editorKey as key to force destroy and mount
        // when switching between two identical editors with different editor keys
        // otherwise the editor will see an update and its useStore will return one tick later
        // which would forbid the usage of uncontrolled inputs in the editor
        setEditor(
            cloneElement(editor, {
                preferenceKey: prefixedPreferenceKey,
                key: prefixedPreferenceKey,
            })
        );
        // as we modify the editor, isEditorOpen cannot compare the editor element
        // we'll compare the editor key instead
        setPreferenceKey(prefixedPreferenceKey);
    };

    const handleShowButton = () => {
        setIsCustomizeButtonVisible(true);
    };

    const handleHideButton = () => {
        setIsCustomizeButtonVisible(false);
    };

    return (
        <PreferenceKeyContextProvider value={prefixedPreferenceKey}>
            <Root
                className={clsx(
                    ConfigurableClasses.root,
                    isEnabled && ConfigurableClasses.editMode,
                    isEditorOpen && ConfigurableClasses.editorActive
                )}
                sx={sx}
                ref={wrapperRef}
                onMouseEnter={isEnabled ? handleShowButton : undefined}
                onMouseLeave={isEnabled ? handleHideButton : undefined}
            >
                {children}
            </Root>
            <Popover
                open={isEnabled && (isCustomizeButtonVisible || isEditorOpen)}
                sx={{
                    pointerEvents: 'none',
                    '& .MuiPaper-root': {
                        pointerEvents: 'auto',
                        borderRadius: 10,
                        padding: '2px',
                        lineHeight: 0,
                        backgroundColor: 'warning.light',
                        color: 'warning.contrastText',
                        '&:hover': {
                            cursor: 'pointer',
                        },
                    },
                }}
                anchorEl={wrapperRef.current}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                onClose={handleHideButton}
                PaperProps={{
                    elevation: 1,
                    onMouseEnter: handleShowButton,
                    onMouseLeave: handleHideButton,
                    title: translate(openButtonLabel),
                    onClick: handleOpenEditor,
                }}
                disableAutoFocus
                disableRestoreFocus
                disableEnforceFocus
                disableScrollLock
                marginThreshold={8}
            >
                <SettingsIcon
                    // @ts-ignore
                    fontSize="12px"
                />
            </Popover>
        </PreferenceKeyContextProvider>
    );
};

export interface ConfigurableProps {
    children: ReactElement;
    editor: ReactElement;
    preferenceKey: string;
    openButtonLabel?: string;
    sx?: SxProps;
}

const PREFIX = 'RaConfigurable';

export const ConfigurableClasses = {
    root: `${PREFIX}-root`,
    editMode: `${PREFIX}-editMode`,
    editorActive: `${PREFIX}-editorActive`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    [`&.${ConfigurableClasses.editMode}`]: {
        transition: theme.transitions.create('outline'),
        outline: `${alpha(theme.palette.warning.main, 0.3)} solid 2px`,
    },
    [`&.${ConfigurableClasses.editMode}:hover `]: {
        outline: `${alpha(theme.palette.warning.main, 0.5)} solid 2px`,
    },
    [`&.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive} , &.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive}:hover `]: {
        outline: `${theme.palette.warning.main} solid 2px`,
    },
}));
