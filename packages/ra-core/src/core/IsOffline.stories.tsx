import { onlineManager } from '@tanstack/react-query';
import React from 'react';
import { IsOffline } from './IsOffline';

export default {
    title: 'ra-core/core/IsOffline',
};

export const Basic = ({ isOnline = true }: { isOnline?: boolean }) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <>
            <p>Use the story controls to simulate offline mode:</p>
            <IsOffline>
                <p style={{ color: 'orange' }}>
                    You are offline, the data may be outdated
                </p>
            </IsOffline>
        </>
    );
};

Basic.args = {
    isOnline: true,
};

Basic.argTypes = {
    isOnline: {
        control: { type: 'boolean' },
    },
};
