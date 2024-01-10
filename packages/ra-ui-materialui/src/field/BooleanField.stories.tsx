import { Stack } from '@mui/material';
import * as React from 'react';

import { BooleanField, BooleanFieldProps } from './BooleanField';

export default { title: 'ra-ui-materialui/fields/BooleanField' };

export const Basic = (props: BooleanFieldProps) => {
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

export const NoFalseIcon = () => <Basic FalseIcon={null} />;

export const NoTrueIcon = () => <Basic TrueIcon={null} />;

type Post = {
    id: number;
    published: boolean;
    deep: {
        reported: boolean;
    };
    title: string;
};

export const Typed = () => {
    const [published, setPublished] = React.useState(true);
    return (
        <Stack direction="row">
            <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
            />
            <BooleanField<Post>
                record={{
                    id: 1,
                    published,
                    deep: { reported: false },
                    title: '',
                }}
                source="deep.reported"
                sortBy="published"
            />
        </Stack>
    );
};
