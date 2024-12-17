import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Location } from 'react-router-dom';
import {
    getRecordFromLocation,
    useRecordFromLocation,
} from './useRecordFromLocation';
import { TestMemoryRouter, UseRecordFromLocationOptions } from '..';

describe('useRecordFromLocation', () => {
    const UseGetRecordFromLocation = (props: UseRecordFromLocationOptions) => {
        const recordFromLocation = useRecordFromLocation(props);

        return <div>{JSON.stringify(recordFromLocation)}</div>;
    };
    it('return null if there is no location search nor state that contains a record', async () => {
        render(
            <TestMemoryRouter initialEntries={[`/posts/create?value=test`]}>
                <UseGetRecordFromLocation />
            </TestMemoryRouter>
        );

        await screen.findByText('null');
    });
    it('return the record from the location search', async () => {
        const record = { test: 'value' };
        render(
            <TestMemoryRouter
                initialEntries={[
                    `/posts/create?source=${JSON.stringify(record)}`,
                ]}
            >
                <UseGetRecordFromLocation />
            </TestMemoryRouter>
        );

        await screen.findByText(JSON.stringify({ test: 'value' }));
    });
    it('return the record from the location state', async () => {
        const record = { test: 'value' };
        render(
            <TestMemoryRouter
                initialEntries={[
                    { pathname: `/posts/create`, state: { record } },
                ]}
            >
                <UseGetRecordFromLocation />
            </TestMemoryRouter>
        );

        await screen.findByText(JSON.stringify({ test: 'value' }));
    });
});

describe('getRecordFromLocation', () => {
    const location: Location = {
        key: 'a_key',
        pathname: '/foo',
        search: '',
        state: undefined,
        hash: '',
    };

    it('should return location state record when set', () => {
        expect(
            getRecordFromLocation({
                ...location,
                state: { record: { foo: 'bar' } },
            })
        ).toEqual({ foo: 'bar' });
    });

    it('should return location state record when set with a custom key', () => {
        expect(
            getRecordFromLocation(
                {
                    ...location,
                    state: { myRecord: { foo: 'bar' } },
                },
                { stateSource: 'myRecord' }
            )
        ).toEqual({ foo: 'bar' });
    });

    it('should return location search when set', () => {
        expect(
            getRecordFromLocation({
                ...location,
                search: '?source={"foo":"baz","array":["1","2"]}',
            })
        ).toEqual({ foo: 'baz', array: ['1', '2'] });
    });

    it('should return location search when set with a custom key', () => {
        expect(
            getRecordFromLocation(
                {
                    ...location,
                    search: '?mySource={"foo":"baz","array":["1","2"]}',
                },
                {
                    searchSource: 'mySource',
                }
            )
        ).toEqual({ foo: 'baz', array: ['1', '2'] });
    });

    it('should return location state record when both state and search are set', () => {
        expect(
            getRecordFromLocation({
                ...location,
                state: { record: { foo: 'bar' } },
                search: '?foo=baz',
            })
        ).toEqual({ foo: 'bar' });
    });
});
