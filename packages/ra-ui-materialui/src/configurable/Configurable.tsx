import * as React from 'react';
import { useRef, cloneElement, ReactElement } from 'react';
import { usePreferencesEditor } from 'ra-core';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { InspectorButton } from './InspectorButton';

/**
 * Wrap any component with this component to make it configurable
 *
 * When the edit mode is enabled, users will see a button to edit the component;
 * when clicked, the inspector will show the editor element.
 *
 * The child component fust forward its ref to the root DOM element
 *
 * @example
 * const ConfigurableTextBlock = (props) => (
 *     <Configurable editor={<TextBlockInspector />}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 *
 * @example // with editorKey (allows more than one editor of that type per page)
 * const ConfigurableTextBlock = ({ editorKey, ...props }) => (
 *     <Configurable editor={<TextBlockInspector />} editorKey={editorKey}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 */
export const Configurable = (props: ConfigurableProps) => {
    const {
        children,
        editor,
        editorKey,
        openButtonLabel = 'ra.configurable.customize',
    } = props;
    const ref = useRef(null);
    const rect = ref.current?.getBoundingClientRect();

    const preferencesEditorContext = usePreferencesEditor();
    if (!preferencesEditorContext) {
        return children;
    }
    const {
        isEnabled,
        editor: currentEditor,
        setEditor,
        editorKey: currentEditorKey,
        setEditorKey,
    } = preferencesEditorContext;

    const handleOpenEditor = () => {
        if (editorKey) {
            // include the editorKey as key to force destroy and mount
            // when switching between two identical editors with different editor keys
            // otherwise the editor will see an update and its useStore will return one tick later
            // which would forbid the usage of uncontrolled inputs ion the editor
            setEditor(cloneElement(editor, { editorKey, key: editorKey }));
            // as we modify the editor, isEditorOpen cannot compare the editor element
            // we'll compare the editor key instead
            setEditorKey(editorKey);
        } else {
            setEditor(editor);
        }
    };

    const isEditorOpen = editorKey
        ? editorKey === currentEditorKey
        : editor === currentEditor;

    return (
        <Root
            className={clsx(
                isEnabled && ConfigurableClasses.editMode,
                isEditorOpen && ConfigurableClasses.editorActive
            )}
        >
            {editorKey
                ? cloneElement(children, { ref, editorKey })
                : cloneElement(children, { ref })}
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
    children: ReactElement;
    editor: ReactElement;
    editorKey?: string;
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
    [`& .${ConfigurableClasses.button}`]: {
        display: 'none',
    },
    [`&.${ConfigurableClasses.editMode}:hover > .${ConfigurableClasses.button}`]: {
        display: 'block',
        position: 'absolute',
        zIndex: theme.zIndex.modal - 1,
    },
    [`&.${ConfigurableClasses.editMode} > :not(.${ConfigurableClasses.button})`]: {
        transition: theme.transitions.create('box-shadow'),
        boxShadow: `${alpha(theme.palette.primary.main, 0.3)} 0px 0px 0px 2px`,
    },
    [`&.${ConfigurableClasses.editMode}:hover > :not(.${ConfigurableClasses.button})`]: {
        boxShadow: `${alpha(theme.palette.primary.main, 0.5)} 0px 0px 0px 2px`,
    },

    [`&.${ConfigurableClasses.editorActive} > :not(.${ConfigurableClasses.button}), &.${ConfigurableClasses.editorActive}:hover > :not(.${ConfigurableClasses.button})`]: {
        boxShadow: ` ${theme.palette.primary.main} 0px 0px 0px 2px`,
    },
}));
