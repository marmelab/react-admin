import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';

import ListContext from './ListContext';
import useListContext from './useListContext';
import { ResourceProvider } from '../core';

describe('useListContext', () => {
    afterEach(cleanup);

    const NaiveList = props => {
        const { ids, data } = useListContext(props);
        return (
            <ul>
                {ids.map(id => (
                    <li key={id}>{data[id].title}</li>
                ))}
            </ul>
        );
    };

    it('should return the listController props form the ListContext', () => {
        const { getByText } = render(
            <ResourceProvider
                value={{
                    resource: 'foo',
                    hasList: true,
                    hasCreate: true,
                    hasEdit: true,
                    hasShow: true,
                }}
            >
                <ListContext.Provider
                    // @ts-ignore
                    value={{
                        ids: [1],
                        data: { 1: { id: 1, title: 'hello' } },
                    }}
                >
                    <NaiveList />
                </ListContext.Provider>
            </ResourceProvider>
        );
        expect(getByText('hello')).toBeDefined();
    });

    it('should return injected props if the context was not set', () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        const { getByText } = render(
            <NaiveList
                resource="foo"
                ids={[1]}
                data={{ 1: { id: 1, title: 'hello' } }}
            />
        );
        expect(getByText('hello')).toBeDefined();
    });
});
