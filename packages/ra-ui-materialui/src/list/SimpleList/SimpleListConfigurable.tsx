import * as React from 'react';
import { useResourceContext, useStore, usePreferenceKey } from 'ra-core';

import { Configurable } from '../../preferences';
import { SimpleList, SimpleListProps } from './SimpleList';
import { SimpleListEditor } from './SimpleListEditor';

export const SimpleListConfigurable = ({
    preferenceKey,
    ...props
}: SimpleListProps & { preferenceKey?: string }) => {
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
            <SimpleListWithPreferences {...props} />
        </Configurable>
    );
};

const SimpleListWithPreferences = (props: SimpleListProps) => {
    const preferenceKey = usePreferenceKey();
    const [primaryTextFromStore] = useStore(`${preferenceKey}.primaryText`);
    const [secondaryTextFromStore] = useStore(`${preferenceKey}.secondaryText`);
    const [tertiaryTextFromStore] = useStore(`${preferenceKey}.tertiaryText`);
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
