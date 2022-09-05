import * as React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { alpha, Fade, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { InspectorButton } from './InspectorButton';
import { usePreferencesEditor } from 'ra-core';

export const Configurable = (props: ConfigurableProps) => {
    const { children, editableEl, editor, openButtonLabel } = props;
    const buttonRef = useRef<HTMLButtonElement>();
    const [showEditorButton, setShowEditorButton] = useState(false);
    const { isEnabled, setEditor } = usePreferencesEditor();

    const handleMouseEnter = (event: MouseEvent) => {
        event.stopPropagation();
        setShowEditorButton(true);
    };

    const handleMouseLeave = (event: MouseEvent) => {
        // We don't want to hide the configuration button if users hover it
        // To ensure that, we check whether the cursor is still over the editor target (the table element for the Datagrid for example)
        const targetRect = (event.target as Element).getBoundingClientRect();
        const isMouseHoverTarget =
            event.clientX > targetRect.left &&
            event.clientX < targetRect.right &&
            event.clientY > targetRect.top &&
            event.clientY < targetRect.bottom;

        if (!isMouseHoverTarget) {
            setShowEditorButton(false);
        }
    };

    useEffect(() => {
        if (!editableEl) {
            return;
        }
        if (isEnabled) {
            editableEl.classList.add(ConfigurableClasses.element);
            editableEl.addEventListener('mouseover', handleMouseEnter);
            editableEl.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            setShowEditorButton(false);

            editableEl.classList.remove(ConfigurableClasses.element);
            editableEl.removeEventListener('mouseover', handleMouseEnter);
            editableEl.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [editableEl, isEnabled]);

    const handleOpenEditor = () => {
        setEditor(editor);
    };

    return (
        <Root>
            <Popper
                open={showEditorButton}
                anchorEl={editableEl}
                placement="top-end"
                className={ConfigurableClasses.popper}
                modifiers={popperModifiers}
            >
                <InspectorButton
                    ref={buttonRef}
                    onClick={handleOpenEditor}
                    label={openButtonLabel}
                />
            </Popper>
            {children}
        </Root>
    );
};

const popperModifiers = [
    { name: 'offset', enabled: true, options: { offset: [0, -30] } },
    { name: 'flip', enabled: false },
    { name: 'hide', enabled: false },
    { name: 'preventOverflow', enabled: false, options: { padding: 0 } },
];

export interface ConfigurableProps {
    children: ReactNode;
    editableEl?: HTMLElement | null;
    editor: ReactNode;
    openButtonLabel: string;
}

const PREFIX = 'RaConfigurable';

export const ConfigurableClasses = {
    popper: `${PREFIX}-popper`,
    element: `${PREFIX}-element`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ConfigurableClasses.popper}`]: {
        zIndex: theme.zIndex.modal - 1,
    },
    [`& .${ConfigurableClasses.element}`]: {
        boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${alpha(
            theme.palette.primary.main,
            0.3
        )} 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
        '&:hover': {
            boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${theme.palette.primary.main} 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
        },
    },
}));
