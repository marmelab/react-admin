import * as React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { alpha, Fade, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { InspectorButton } from './InspectorButton';
import { usePreferencesEditor } from 'ra-core';

export const Configurable = (props: ConfigurableProps) => {
    const { children, elementRef, editor, openButtonLabel } = props;
    const [showEditorButton, setShowEditorButton] = useState(false);
    const { isEnabled, setEditor } = usePreferencesEditor();

    const handleMouseOver = (event: MouseEvent) => {
        event.stopPropagation();
        setShowEditorButton(true);
        const element = event.target as Element;
        element.classList.add(ConfigurableClasses.hover);
    };

    const handleMouseOut = (event: MouseEvent) => {
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
            (event.target as Element).classList.remove(
                ConfigurableClasses.hover
            );
        }
    };

    useEffect(() => {
        if (!elementRef.current) {
            return;
        }
        const element = elementRef.current;
        if (isEnabled) {
            element.classList.add(ConfigurableClasses.element);
            element.addEventListener('mouseover', handleMouseOver);
            element.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            setShowEditorButton(false);
            element.classList.remove(ConfigurableClasses.element);
            element.removeEventListener('mouseover', handleMouseOver);
            element.removeEventListener('mouseout', handleMouseOut);
        };
    }, [elementRef, isEnabled]);

    const handleOpenEditor = () => {
        setEditor(editor);
    };

    return (
        <Root>
            <Popper
                open={showEditorButton}
                anchorEl={elementRef.current}
                placement="top-end"
                className={ConfigurableClasses.popper}
                modifiers={popperModifiers}
            >
                <InspectorButton
                    onClick={handleOpenEditor}
                    label={openButtonLabel}
                    size="small"
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
    elementRef: React.RefObject<HTMLElement>;
    editor: ReactNode;
    openButtonLabel: string;
}

const PREFIX = 'RaConfigurable';

export const ConfigurableClasses = {
    popper: `${PREFIX}-popper`,
    element: `${PREFIX}-element`,
    hover: `${PREFIX}-hover`,
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
        )} 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
        [`&.${ConfigurableClasses.hover}`]: {
            boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px, ${theme.palette.primary.main} 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`,
        },
    },
}));
