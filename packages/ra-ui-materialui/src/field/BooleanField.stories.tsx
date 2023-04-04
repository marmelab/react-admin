import { Stack } from '@mui/material';
import * as React from 'react';

import { BooleanField, BooleanFieldProps } from './BooleanField';

export default { title: 'ra-ui-materialui/fields/BooleanField' };

export const Basic = (props: Omit<BooleanFieldProps, 'source'>) => {
    const [value, setValue] = React.useState(true);
    return (
        <Stack direction="row">
            <input
                type="checkbox"
                checked={value}
                onChange={e => setValue(e.target.checked)}
            />
            <BooleanField record={{ value }} source="value" {...props} />
        </Stack>
    );
};

type Post = {
    published: boolean;
    reported: boolean;
    title: string;
};

export const Typed = (props: Omit<BooleanFieldProps, 'source' | 'sortBy'>) => {
    const [published, setPublished] = React.useState(true);
    return (
        <Stack direction="row">
            <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
            />
            <BooleanField<Post>
                record={{ published }}
                source="published"
                sortBy="published"
                {...props}
            />
        </Stack>
    );
};

export const NoFalseIcon = () => <Basic FalseIcon={null} />;

export const NoTrueIcon = () => <Basic TrueIcon={null} />;
