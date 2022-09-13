import * as React from 'react';
import { useRef, useEffect, cloneElement, ReactElement } from 'react';
import { usePreferencesEditor } from 'ra-core';
import { alpha, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import clsx from 'clsx';

/**
 * Wrap any component with this component to make it configurable
 *
 * When the edit mode is enabled, users will see a button to edit the component;
 * when clicked, the inspector will show the editor element.
 *
 * The child component must forward its ref to the root DOM element
 *
 * @example
 * const ConfigurableTextBlock = (props) => (
 *     <Configurable editor={<TextBlockInspector />}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 *
 * @example // with preferenceKey (allows more than one editor of that type per page)
 * const ConfigurableTextBlock = ({ preferenceKey, ...props }) => (
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
    } = props;

    const preferencesEditorContext = usePreferencesEditor();
    const hasPreferencesEditorContext = !!preferencesEditorContext;

    const {
        isEnabled,
        editor: currentEditor,
        setEditor,
        preferenceKey: currentPreferenceKey,
        setPreferenceKey,
    } = preferencesEditorContext || {};

    const isEditorOpen = preferenceKey
        ? preferenceKey === currentPreferenceKey
        : currentEditor && editor.type === currentEditor.type;
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
        if (preferenceKey) {
            // include the editorKey as key to force destroy and mount
            // when switching between two identical editors with different editor keys
            // otherwise the editor will see an update and its useStore will return one tick later
            // which would forbid the usage of uncontrolled inputs ion the editor
            setEditor(
                cloneElement(editor, { preferenceKey, key: preferenceKey })
            );
            // as we modify the editor, isEditorOpen cannot compare the editor element
            // we'll compare the editor key instead
            setPreferenceKey(preferenceKey);
        } else {
            setEditor(editor);
        }
    };

    return (
        <Root
            className={clsx(
                isEnabled && ConfigurableClasses.editMode,
                isEditorOpen && ConfigurableClasses.editorActive
            )}
        >
            <Badge
                badgeContent={
                    <SettingsIcon
                        label={openButtonLabel}
                        // @ts-ignore
                        fontSize="12px"
                    />
                }
                componentsProps={{
                    badge: {
                        onClick: handleOpenEditor,
                    },
                }}
                color="warning"
                invisible={!isEnabled}
            >
                {preferenceKey
                    ? cloneElement(children, { preferenceKey })
                    : children}
            </Badge>
        </Root>
    );
};

export interface ConfigurableProps {
    children: ReactElement;
    editor: ReactElement;
    preferenceKey?: string;
    openButtonLabel?: string;
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
        position: 'absolute',
        zIndex: theme.zIndex.modal - 1,
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
