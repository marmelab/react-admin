import * as React from 'react';

export const SimpleShowLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {React.Children.map(children, child => (
            <div>{child}</div>
        ))}
    </div>
);
