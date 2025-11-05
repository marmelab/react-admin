import * as React from 'react';
import { Translate } from '../i18n/Translate';
import {
    useDeleteController,
    UseDeleteControllerParams,
} from '../controller/button/useDeleteController';
import { useRecordContext } from '../controller/record/useRecordContext';

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
