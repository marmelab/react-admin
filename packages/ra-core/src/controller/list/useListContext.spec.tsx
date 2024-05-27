import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { ListContext } from './ListContext';
import { useListContext } from './useListContext';

describe('useListContext', () => {
    const NaiveList = () => {
        const { isPending, error, data } = useListContext();
        if (isPending || error) {
            return null;
        }
        return (
            <ul>
                {data.map(record => (
                    <li key={record.id}>{record.title}</li>
                ))}
            </ul>
        );
    };

    it('should return the listController props form the ListContext', () => {
        const { getByText } = render(
            <ListContext.Provider
                // @ts-ignore
                value={{
                    resource: 'foo',
                    data: [{ id: 1, title: 'hello' }],
                }}
            >
                <NaiveList />
            </ListContext.Provider>
        );
        expect(getByText('hello')).not.toBeNull();
    });

    it('should throw when called outside of a ListContextProvider', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<NaiveList />)).toThrow(
            'useListContext must be used inside a ListContextProvider'
        );
    });
});
