import * as React from 'react';
import { LinkBase } from '../routing';
import { useResourceContext } from '../core/useResourceContext';

export const CreateButton = (props: { resource?: string }) => {
    const resource = useResourceContext(props);

    return (
        <LinkBase
            to={`/${resource}/create`}
            onClick={e => {
                e.stopPropagation();
            }}
        >
            Create
        </LinkBase>
    );
};
