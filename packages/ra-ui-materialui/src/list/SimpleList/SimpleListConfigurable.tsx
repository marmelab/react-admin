import * as React from 'react';

import { Configurable } from '../../preferences';
import { SimpleList, SimpleListProps } from './SimpleList';
import { SimpleListEditor } from './SimpleListEditor';

export const SimpleListConfigurable = ({
    preferenceKey,
    ...props
}: SimpleListProps) => (
    <Configurable
        editor={<SimpleListEditor resource={props.resource} />}
        preferenceKey={preferenceKey}
        sx={{ '& ul': { flex: 1 } }}
    >
        <SimpleList {...props} />
    </Configurable>
);

SimpleListConfigurable.propTypes = SimpleList.propTypes;
