import * as React from 'react';
import { useRef, useEffect, cloneElement, ReactElement } from 'react';
import { usePreferencesEditor, PreferenceKeyContextProvider } from 'ra-core';
import { alpha, Badge } from '@mui/material';
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

    const {
        isEnabled,
        setEditor,
        preferenceKey: currentPreferenceKey,
        setPreferenceKey,
    } = preferencesEditorContext || {};

    const isEditorOpen = prefixedPreferenceKey === currentPreferenceKey;
    const editorOpenRef = useRef(isEditorOpen);

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

    return (
        <PreferenceKeyContextProvider value={prefixedPreferenceKey}>
            <Root
                className={clsx(
                    isEnabled && ConfigurableClasses.editMode,
                    isEditorOpen && ConfigurableClasses.editorActive
                )}
                sx={sx}
            >
                <Badge
                    badgeContent={
                        <SettingsIcon
                            // @ts-ignore
                            fontSize="12px"
                        />
                    }
                    componentsProps={{
                        badge: {
                            title: openButtonLabel,
                            onClick: handleOpenEditor,
                        },
                    }}
                    color="warning"
                    invisible={!isEnabled}
                >
                    {children}
                </Badge>
            </Root>
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
    editMode: `${PREFIX}-editMode`,
    button: `${PREFIX}-button`,
    editorActive: `${PREFIX}-editorActive`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .MuiBadge-badge`]: {
        visibility: 'hidden',
        pointerEvents: 'none',
        padding: 0,
    },
    [`&.${ConfigurableClasses.editMode}:hover > .MuiBadge-root > .MuiBadge-badge`]: {
        visibility: 'visible',
        pointerEvents: 'initial',
        cursor: 'pointer',
    },
    [`&.${ConfigurableClasses.editMode} > .MuiBadge-root > :not(.MuiBadge-badge)`]: {
        transition: theme.transitions.create('outline'),
        outline: `${alpha(theme.palette.warning.main, 0.3)} solid 2px`,
    },
    [`&.${ConfigurableClasses.editMode}:hover > .MuiBadge-root > :not(.MuiBadge-badge)`]: {
        outline: `${alpha(theme.palette.warning.main, 0.5)} solid 2px`,
    },

    [`&.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive} > .MuiBadge-root > :not(.MuiBadge-badge), &.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive}:hover > .MuiBadge-root > :not(.MuiBadge-badge)`]: {
        outline: `${theme.palette.warning.main} solid 2px`,
    },
}));
