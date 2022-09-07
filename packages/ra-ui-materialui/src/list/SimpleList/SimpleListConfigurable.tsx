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
    >
        <SimpleList {...props} />
    </Configurable>
);

SimpleListConfigurable.propTypes = SimpleList.propTypes;
