import * as React from 'react';

import { Configurable } from '../../configurable';
import { SimpleList, SimpleListProps } from './SimpleList';
import { SimpleListEditor } from './SimpleListEditor';

export const SimpleListConfigurable = ({
    preferencesKey,
    ...props
}: SimpleListProps) => (
    <Configurable
        editor={<SimpleListEditor resource={props.resource} />}
        preferencesKey={preferencesKey}
    >
        <SimpleList {...props} />
    </Configurable>
);

SimpleListConfigurable.propTypes = SimpleList.propTypes;
