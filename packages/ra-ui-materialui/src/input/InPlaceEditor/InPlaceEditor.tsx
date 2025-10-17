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
    type UseUpdateOptions,
    type RaRecord,
} from 'ra-core';
import isEqual from 'lodash/isEqual.js';
import { styled } from '@mui/material/styles';
import { Box, IconButton, type SxProps } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { TextInput } from '../TextInput';
import { TextField } from '../../field';

export type InPlaceEditorAction =
    | { type: 'edit' }
    | { type: 'save'; values: any }
    | { type: 'cancel' }
    | { type: 'success' }
    | { type: 'error'; error: any };

export type InPlaceEditorValue =
    | { state: 'editing' }
    | { state: 'saving'; values: any }
    | { state: 'reading' };

export interface InPlaceEditorProps<
    RecordType extends RaRecord = any,
    ErrorType = Error,
> {
    source?: string;
    mutationMode?: 'optimistic' | 'pessimistic' | 'undoable';
    mutationOptions?: UseUpdateOptions<RecordType, ErrorType>;
    cancelOnBlur?: boolean;
    notifyOnSuccess?: boolean;
    resource?: string;
    showButtons?: boolean;
    children?: React.ReactNode;
    editor?: React.ReactNode;
    sx?: SxProps;
}

/**
 * Renders a value, and on click it turns into an editable field.
 *
 * The editable field is rendered inside a Form component, so InPlaceEditor
 * cannot be used inside another Form component.
 */
export const InPlaceEditor = <
    RecordType extends RaRecord = any,
    ErrorType extends Error = Error,
>(
    props: InPlaceEditorProps<RecordType, ErrorType>
) => {
    const {
        source,
        mutationMode,
        mutationOptions = {},
        sx,
        cancelOnBlur,
        children = source ? (
            <TextField
                source={source}
                variant="body1"
                component="div"
                sx={{ marginBottom: '5px' }}
            />
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
            />
        ) : null,
        showButtons,
        notifyOnSuccess,
    } = props;

    if (!source && !children && !editor) {
        throw new Error(
            'InPlaceEditor requires either a source prop or children or editor prop'
        );
    }
    if (mutationMode === 'undoable' && !notifyOnSuccess) {
        throw new Error(
            'InPlaceEditor requires notifyOnSuccess to be true when mutationMode is undoable'
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
    const resource = useResourceContext(props);
    const notify = useNotify();
    const translate = useTranslate();
    const [update] = useUpdate();

    const {
        meta: mutationMeta,
        onSuccess = () => {
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
        onError = error => {
            notify('ra.notification.http_error', {
                type: 'error',
                messageArgs: { _: error.message },
            });
            dispatch({ type: 'error', error });
        },
        ...otherMutationOptions
    } = mutationOptions;

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
                meta: mutationMeta,
            },
            {
                onSuccess,
                onError,
                mutationMode,
                ...otherMutationOptions,
            }
        );
    };

    const handleEdit = () => {
        dispatch({ type: 'edit' });
    };
    const handleCancel = () => {
        dispatch({ type: 'cancel' });
    };
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            dispatch({ type: 'cancel' });
        }
    };

    const handleBlur = (event: React.FocusEvent) => {
        if (event.relatedTarget) {
            return;
        }
        if (cancelOnBlur) {
            dispatch({ type: 'cancel' });
            return;
        }
        if (state.state === 'editing') {
            // trigger the parent form submit
            // to save the changes
            (submitButtonRef.current as HTMLButtonElement).click();
        }
    };

    const renderContent = () => {
        switch (state.state) {
            case 'reading':
                return (
                    <Box
                        onClick={handleEdit}
                        className={InPlaceEditorClasses.reading}
                    >
                        {children}
                    </Box>
                );
            case 'editing':
                return (
                    <Form onSubmit={handleSave}>
                        <Box
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className={InPlaceEditorClasses.editing}
                        >
                            {editor}
                            {showButtons ? (
                                <>
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
                                        aria-label={translate(
                                            'ra.action.cancel'
                                        )}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </>
                            ) : (
                                <button
                                    type="submit"
                                    style={{ display: 'none' }}
                                    ref={submitButtonRef}
                                />
                            )}
                        </Box>
                    </Form>
                );
            case 'saving':
                // set a custom record context with the new values
                // to avoid flickering
                return (
                    <RecordContextProvider value={state.values}>
                        <Box className={InPlaceEditorClasses.saving}>
                            {children}
                        </Box>
                    </RecordContextProvider>
                );
            default:
                throw new Error('Unhandled state');
        }
    };

    return <Root sx={sx}>{renderContent()}</Root>;
};

const PREFIX = 'RaInPlaceEditor';

const InPlaceEditorClasses = {
    reading: `${PREFIX}-reading`,
    editing: `${PREFIX}-editing`,
    saving: `${PREFIX}-saving`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${InPlaceEditorClasses.reading}`]: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    [`& .${InPlaceEditorClasses.editing}`]: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
    },
    [`& .${InPlaceEditorClasses.saving}`]: { opacity: 0.5 },
}));
