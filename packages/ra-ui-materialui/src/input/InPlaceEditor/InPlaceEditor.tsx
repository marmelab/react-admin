import * as React from 'react';
import { useReducer, useRef } from 'react';
import {
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
    useUpdate,
    Form,
    RecordContextProvider,
} from 'ra-core';
import isEqual from 'lodash/isEqual';
import { Box, IconButton, type SxProps } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import {
    InPlaceEditorContext,
    type InPlaceEditorValue,
    type InPlaceEditorAction,
} from './InPlaceEditorContext';
import { TextInput } from '../TextInput';
import { TextField } from '../../field';

export interface InPlaceEditorProps {
    source?: string;
    mutationMode?: 'optimistic' | 'pessimistic' | 'undoable';
    cancelOnBlur?: boolean;
    notifyOnSuccess?: boolean;
    children?: React.ReactNode;
    editor?: React.ReactNode;
    sx?: SxProps;
}

export const InPlaceEditor = (props: InPlaceEditorProps) => {
    const {
        source,
        mutationMode,
        sx,
        cancelOnBlur,
        children = source ? (
            <Box sx={{ mb: 0.8 }}>
                <TextField
                    source={source}
                    variant="body1"
                    sx={sx}
                    component="div"
                />
            </Box>
        ) : null,
        editor = source ? (
            <TextInput
                source={source}
                size="small"
                margin="none"
                label={false}
                variant="standard"
                autoFocus
                helperText={false}
                InputProps={{ sx }}
            />
        ) : null,
        notifyOnSuccess,
    } = props;

    if (!source && !children && !editor) {
        throw new Error(
            'InPlaceEditor requires either a source prop or children or editor prop'
        );
    }

    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const [state, dispatch] = useReducer<
        (
            state: InPlaceEditorValue,
            action: InPlaceEditorAction
        ) => InPlaceEditorValue
    >(
        (_, action) => {
            switch (action.type) {
                case 'edit':
                    return { state: 'editing' };
                case 'save':
                    return { state: 'saving', values: action.values };
                case 'error':
                case 'success':
                case 'cancel':
                    return { state: 'reading' };
                default:
                    throw new Error('Unhandled action');
            }
        },
        { state: 'reading' }
    );

    const record = useRecordContext();
    const resource = useResourceContext();
    const notify = useNotify();
    const [update] = useUpdate();
    const translate = useTranslate();

    const handleSave = async values => {
        if (!record) {
            throw new Error('No record found');
        }
        if (isEqual(values, record)) {
            dispatch({ type: 'cancel' });
            return;
        }
        dispatch({ type: 'save', values });
        update(
            resource,
            {
                id: record.id,
                data: values,
                previousData: record,
            },
            {
                mutationMode,
                onSuccess: () => {
                    dispatch({ type: 'success' });
                    if (mutationMode !== 'undoable' && !notifyOnSuccess) return;
                    notify(`resources.${resource}.notifications.updated`, {
                        type: 'info',
                        messageArgs: {
                            smart_count: 1,
                            _: translate('ra.notification.updated', {
                                smart_count: 1,
                            }),
                        },
                        undoable: mutationMode === 'undoable',
                    });
                },
                onError: error => {
                    notify('ra.notification.http_error', {
                        type: 'error',
                        messageArgs: { _: error.message },
                    });
                    dispatch({ type: 'error', error });
                },
            }
        );
    };

    const handleEdit = () => {
        dispatch({ type: 'edit' });
    };
    const handleCancel = () => {
        dispatch({ type: 'cancel' });
    };
    const handleBlur = (event: React.FocusEvent) => {
        if (event.relatedTarget) {
            return;
        }
        if (cancelOnBlur) {
            dispatch({ type: 'cancel' });
        }
        if (state.state === 'editing') {
            // trigger the submit button click
            // to save the changes
            (submitButtonRef.current as HTMLButtonElement).click();
        }
    };

    return (
        <InPlaceEditorContext.Provider value={{ state, dispatch }}>
            {state.state === 'reading' ? (
                <Box
                    onClick={handleEdit}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    {children}
                </Box>
            ) : state.state === 'editing' ? (
                <Form onSubmit={handleSave}>
                    <Box
                        onKeyDown={event => {
                            if (event.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        onBlur={handleBlur}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {editor}
                        <IconButton
                            size="small"
                            type="submit"
                            ref={submitButtonRef}
                            aria-label={translate('ra.action.save')}
                        >
                            <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleCancel}
                            aria-label={translate('ra.action.cancel')}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Form>
            ) : state.state === 'saving' ? (
                <RecordContextProvider value={state.values}>
                    <Box sx={{ opacity: 0.5 }}>{children}</Box>
                </RecordContextProvider>
            ) : (
                ''
            )}
        </InPlaceEditorContext.Provider>
    );
};
