import * as React from 'react';
import { useEffect } from 'react';
import { useStore, usePreferencesEditor, useTranslate } from 'ra-core';
import { Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/CancelOutlined';
import { useTheme, styled } from '@mui/material/styles';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import { InspectorRoot } from './InspectorRoot';

export const Inspector = () => {
    const {
        isEnabled,
        disable,
        title,
        titleOptions,
        editor,
    } = usePreferencesEditor();
    const theme = useTheme();
    const translate = useTranslate();

    const [dialogPosition, setDialogPosition] = useStore(
        'ra.inspector.position',
        {
            x:
                // We want it positioned to the far right of the screen
                document.body.clientWidth -
                // So we remove its size (see the root css class)
                theme.breakpoints.values.sm / 2 -
                // And add a margin
                8,
            y: 8,
        }
    );

    useEffect(() => {
        if (dialogPosition.x > document.body.clientWidth) {
            setDialogPosition({
                x:
                    // We want it positioned to the far right of the screen
                    document.body.clientWidth -
                    // So we remove its size (see the root css class)
                    theme.breakpoints.values.sm / 2 -
                    // And add a margin
                    8,
                y: 8,
            });
        }
    }, [isEnabled, dialogPosition, setDialogPosition, theme]);

    const handleDraggableStop: DraggableEventHandler = (e, data) => {
        setDialogPosition({ x: data.x, y: data.y });
    };

    if (!isEnabled) return null;
    return (
        <Root>
            <Draggable
                handle="#inspectore-dialog-title"
                defaultPosition={dialogPosition}
                onStop={handleDraggableStop}
                bounds="body"
            >
                <Paper className={InspectorClasses.modal} elevation={3}>
                    <div className={InspectorClasses.title}>
                        <Typography
                            id="inspectore-dialog-title"
                            variant="overline"
                            component="div"
                            py={1}
                            px={2}
                            flex="1"
                        >
                            {translate(title, titleOptions)}
                        </Typography>
                        <IconButton
                            aria-label={translate('ra.action.close')}
                            onClick={disable}
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                    <div className={InspectorClasses.content}>
                        {editor || <InspectorRoot />}
                    </div>
                </Paper>
            </Draggable>
        </Root>
    );
};

const PREFIX = 'RaInspector';

export const InspectorClasses = {
    modal: `${PREFIX}-modal`,
    title: `${PREFIX}-title`,
    content: `${PREFIX}-content`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${InspectorClasses.modal}`]: {
        position: 'absolute',
        zIndex: theme.zIndex.modal,
        width: theme.breakpoints.values.sm / 2,
        transition: theme.transitions.create(['height', 'width']),
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
