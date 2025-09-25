import * as React from 'react';
import {
    Translate,
    useDeleteController,
    UseDeleteControllerParams,
    useRecordContext,
} from '../';

export const DeleteButton = (
    props: UseDeleteControllerParams & { label: React.ReactNode }
) => {
    const record = useRecordContext();
    const controllerProps = useDeleteController({
        record,
        mutationMode: 'optimistic',
        ...props,
    });

    return (
        <button
            type="button"
            onClick={event => {
                event.stopPropagation();
                controllerProps.handleDelete();
            }}
        >
            {typeof props.label !== 'string' ? (
                props.label
            ) : (
                <Translate
                    i18nKey={
                        typeof props.label === 'string'
                            ? props.label
                            : 'ra.action.delete'
                    }
                >
                    {typeof props.label === 'string' ? props.label : 'Delete'}
                </Translate>
            )}
        </button>
    );
};
