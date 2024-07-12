import { Stack, Typography } from '@mui/material';
import React, { ReactNode, isValidElement, cloneElement } from 'react';
import { useRecordContext, RecordContextProvider } from 'react-admin';

interface ObjectFieldProps {
    source: string;
    children: ReactNode;
    record?: any;
    showLabels?: boolean;
}

interface ChildProps {
    label?: string;
    source: string;
    record?: any;
}

// Utility function to capitalize the first letter of each word
const capitalizeWords = (text: string) => {
    return text
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const ObjectField: React.FC<ObjectFieldProps> = ({
    source,
    children,
    record,
    showLabels = true,
}) => {
    const contextRecord = useRecordContext();
    const effectiveRecord = record || contextRecord;
    const nestedData = effectiveRecord ? effectiveRecord[source] : null;

    if (!nestedData) return null;

    return (
        <Stack>
            {React.Children.map(children, child => {
                if (isValidElement<ChildProps>(child)) {
                    const { label: childLabel, source: childSource } =
                        child.props;
                    const displayLabel = childLabel
                        ? childLabel
                        : capitalizeWords(childSource);
                    return (
                        <Stack
                            key={childSource}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            {showLabels && (
                                <Typography variant="body2">
                                    {displayLabel}:
                                </Typography>
                            )}
                            <RecordContextProvider value={nestedData}>
                                {cloneElement(child, { record: nestedData })}
                            </RecordContextProvider>
                        </Stack>
                    );
                }
                return null;
            })}
        </Stack>
    );
};
