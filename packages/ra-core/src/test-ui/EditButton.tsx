import * as React from 'react';
import { Link } from 'react-router-dom';
import type { RaRecord } from '../types';
import { useRecordContext } from '../controller/record/useRecordContext';
import { useResourceContext } from '../core/useResourceContext';

export const EditButton = (props: { record?: RaRecord; resource?: string }) => {
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    if (!record) return null;
    return (
        <Link
            to={`/${resource}/${record.id}`}
            onClick={e => {
                e.stopPropagation();
            }}
        >
            Edit
        </Link>
    );
};
