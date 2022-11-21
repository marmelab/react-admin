import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    useStore,
    usePreferencesEditor,
    useTranslate,
    useRemoveItemsFromStore,
    PreferenceKeyContextProvider,
} from 'ra-core';
import { Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useTheme, styled } from '@mui/material/styles';

import { InspectorRoot } from './InspectorRoot';

export const Inspector = () => {
    const {
        isEnabled,
        disable,
        title,
        titleOptions,
        editor,
        preferenceKey,
    } = usePreferencesEditor();

    const isDragging = useRef(false);
    const removeItems = useRemoveItemsFromStore(preferenceKey);
    const theme = useTheme();
    const translate = useTranslate();
    const [version, setVersion] = useState(0);

    const [dialogPosition, setDialogPosition] = useStore(
        'ra.inspector.position',
        {
            x:
                // We want it positioned to the far right of the screen
                document?.body.clientWidth -
                // So we remove its size (see the root css class)
                theme.breakpoints.values.sm / 2 -
                // And add a margin
                8,
            y: 8,
        }
    );

    // poor man's drag and drop
    // store click position relative to the dialog position
    const [clickPosition, setClickPosition] = useState<
        { x: number; y: number } | undefined
    >();
    const handleDragStart = e => {
        // exit if the user drags on anything but the title
        const draggedElement = document?.elementFromPoint(e.clientX, e.clientY);
        if (draggedElement.id !== 'inspector-dialog-title') {
            return;
        }
        isDragging.current = true;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('inspector', '');
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
        setClickPosition({
            x: e.clientX - dialogPosition.x,
            y: e.clientY - dialogPosition.y,
        });
    };
    const handleDragEnd = e => {
        if (isDragging.current) {
            setDialogPosition({
                x: e.clientX - clickPosition.x,
                y: e.clientY - clickPosition.y,
            });
            e.target.classList.remove('hide');
            isDragging.current = false;
        }
    };

    // prevent "back to base" animation when the inspector is dropped
    useEffect(() => {
        if (!isEnabled) return;
        const handleDragover = e => {
            if (e.dataTransfer.types.includes('inspector')) {
                e.preventDefault();
            }
        };
        document?.addEventListener('dragover', handleDragover);
        return () => {
            document?.removeEventListener('dragover', handleDragover);
        };
    }, [isEnabled]);

    // make sure that the dialog is always visible, as the stored position may be outside the screen
    useEffect(() => {
        if (!isEnabled) return;
        const moveInspectorIfOutsideScreen = () => {
            window?.requestAnimationFrame(() => {
                setDialogPosition(position => ({
                    x: Math.min(
                        position.x,
                        document?.body.clientWidth -
                            theme.breakpoints.values.sm / 2 -
                            8
                    ),
                    y: Math.min(position.y, window?.innerHeight - 50),
                }));
            });
        };
        moveInspectorIfOutsideScreen();
        window?.addEventListener('resize', moveInspectorIfOutsideScreen);
        return () => {
            window?.removeEventListener('resize', moveInspectorIfOutsideScreen);
        };
    }, [isEnabled, setDialogPosition, theme.breakpoints.values.sm]);

    const handleReset = () => {
        removeItems();
        // force redraw of the form to use the default values
        setVersion(version => version + 1);
    };

    if (!isEnabled) return null;
    return (
        <StyledPaper
            className={InspectorClasses.modal}
            elevation={3}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sx={{ left: dialogPosition.x, top: dialogPosition.y }}
        >
            <div className={InspectorClasses.title}>
                <Typography
                    id="inspector-dialog-title"
                    variant="overline"
                    component="div"
                    py={1}
                    px={2}
                    flex="1"
                >
                    {title && translate(title, titleOptions)}
                </Typography>
                <span id="inspector-toolbar" />
                {preferenceKey && (
                    <IconButton
                        aria-label={translate('ra.action.remove')}
                        onClick={handleReset}
                        size="small"
                    >
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                )}
                <IconButton
                    aria-label={translate('ra.action.close')}
                    onClick={disable}
                    size="small"
                    sx={{ mr: 1 }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </div>
            <div className={InspectorClasses.content} key={version}>
                <PreferenceKeyContextProvider value={preferenceKey}>
                    {editor || <InspectorRoot />}
                </PreferenceKeyContextProvider>
            </div>
        </StyledPaper>
    );
};

const PREFIX = 'RaInspector';

export const InspectorClasses = {
    modal: `${PREFIX}-modal`,
    title: `${PREFIX}-title`,
    content: `${PREFIX}-content`,
};

const StyledPaper = styled(Paper, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    position: 'fixed',
    zIndex: theme.zIndex.modal + 1,
    width: theme.breakpoints.values.sm / 2,
    transition: theme.transitions.create(['height', 'width']),
    '&.hide': {
        display: 'none',
    },
    [`& .${InspectorClasses.title}`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'move',
    },
    [`& .${InspectorClasses.content}`]: {
        overflowY: 'auto',
        maxHeight: '75vh',
        padding: theme.spacing(2),
        paddingTop: 0,
    },
}));

Inspector.displayName = 'Inspector';
