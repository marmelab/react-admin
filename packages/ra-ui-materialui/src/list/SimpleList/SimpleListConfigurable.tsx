import * as React from 'react';
import { useResourceContext, usePreference } from 'ra-core';

import { Configurable } from '../../preferences';
import { SimpleList, SimpleListProps } from './SimpleList';
import { SimpleListEditor } from './SimpleListEditor';

export const SimpleListConfigurable = ({
    preferenceKey,
    ...props
}: SimpleListProps & { preferenceKey?: string }) => {
    const resource = useResourceContext(props);
    return (
        <Configurable
            editor={<SimpleListEditor />}
            preferenceKey={preferenceKey || `${resource}.SimpleList`}
            sx={{ display: 'block' }}
        >
            <SimpleListWithPreferences {...props} />
        </Configurable>
    );
};

const SimpleListWithPreferences = (props: SimpleListProps) => {
    const [primaryTextFromStore] = usePreference('primaryText');
    const [secondaryTextFromStore] = usePreference('secondaryText');
    const [tertiaryTextFromStore] = usePreference('tertiaryText');
    return (
        <SimpleList
            {...props}
            primaryText={primaryTextFromStore || props.primaryText}
            secondaryText={secondaryTextFromStore || props.secondaryText}
            tertiaryText={tertiaryTextFromStore || props.tertiaryText}
        />
    );
};

SimpleListConfigurable.propTypes = SimpleList.propTypes;
