import * as React from 'react';
import { TextArrayField } from './TextArrayField';

export default { title: 'ra-ui-materialui/fields/TextArrayField' };

const book = {
    id: 1,
    title: 'War and Peace',
    genres: [
        'Fiction',
        'Historical Fiction',
        'Classic Literature',
        'Russian Literature',
    ],
};

export const Basic = () => <TextArrayField record={book} source="genres" />;

export const EmptyText = () => (
    <TextArrayField
        record={{ genres: [] }}
        source="genres"
        emptyText="No genres available"
    />
);

export const Size = () => (
    <TextArrayField record={book} source="genres" size="medium" />
);

export const Color = () => (
    <TextArrayField record={book} source="genres" color="secondary" />
);

export const Variant = () => (
    <TextArrayField record={book} source="genres" variant="outlined" />
);

export const Direction = () => (
    <TextArrayField
        record={book}
        source="genres"
        direction="column"
        alignItems="flex-start"
    />
);

export const Gap = () => (
    <TextArrayField record={book} source="genres" sx={{ gap: 2 }} />
);
