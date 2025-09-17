import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { ManyResources } from './ListGuesser.stories';

describe('<ListGuesser />', () => {
    it('should log the guessed List views based on the fetched records', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        render(<ManyResources />);
        await screen.findAllByText('top seller', undefined, { timeout: 2000 });
        expect(logSpy).toHaveBeenCalledWith(`Guessed List:

import { DataTable, DateField, EmailField, List, ReferenceArrayField, ReferenceField, TextArrayField } from 'react-admin';

export const ProductList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.NumberCol source="price" />
            <DataTable.Col source="category_id">
                <ReferenceField source="category_id" reference="categories" />
            </DataTable.Col>
            <DataTable.Col source="tags_ids">
                <ReferenceArrayField source="tags_ids" reference="tags" />
            </DataTable.Col>
            <DataTable.Col source="last_update">
                <DateField source="last_update" />
            </DataTable.Col>
            <DataTable.Col source="email">
                <EmailField source="email" />
            </DataTable.Col>
            <DataTable.Col source="sizes">
                <TextArrayField source="sizes" />
            </DataTable.Col>
        </DataTable>
    </List>
);`);
        logSpy.mockClear();

        fireEvent.click(screen.getByText('Categories'));
        await screen.findByText('Jeans');
        expect(logSpy).toHaveBeenCalledWith(`Guessed List:

import { ArrayField, BooleanField, ChipField, DataTable, List, SingleFieldList } from 'react-admin';

export const CategoryList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="alternativeName">
                <ArrayField source="alternativeName">
                    <SingleFieldList>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ArrayField>
            </DataTable.Col>
            <DataTable.Col source="isVeganProduction">
                <BooleanField source="isVeganProduction" />
            </DataTable.Col>
        </DataTable>
    </List>
);`);

        logSpy.mockClear();
        fireEvent.click(screen.getByText('Tags'));
        await screen.findByText('top seller');
        expect(logSpy).toHaveBeenCalledWith(`Guessed List:

import { DataTable, List, UrlField } from 'react-admin';

export const TagList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="url">
                <UrlField source="url" />
            </DataTable.Col>
        </DataTable>
    </List>
);`);
    });
});
