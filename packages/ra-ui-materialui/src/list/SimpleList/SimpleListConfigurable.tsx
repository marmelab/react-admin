import * as React from 'react';
import { useResourceContext } from 'ra-core';

import { Configurable } from '../../preferences';
import { SimpleList, SimpleListProps } from './SimpleList';
import { SimpleListEditor } from './SimpleListEditor';

export const SimpleListConfigurable = ({
    preferenceKey,
    ...props
}: SimpleListProps) => {
    const resource = useResourceContext();
    return (
        <Configurable
            editor={<SimpleListEditor />}
            preferenceKey={preferenceKey || `${resource}.SimpleList`}
            sx={{
                display: 'block',
                '& .MuiBadge-root': { display: 'flex' },
                '& ul': { flex: 1 },
            }}
        >
            <SimpleList {...props} />
        </Configurable>
    );
};

SimpleListConfigurable.propTypes = SimpleList.propTypes;
