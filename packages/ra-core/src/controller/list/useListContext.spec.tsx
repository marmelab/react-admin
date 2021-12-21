import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { ListContext } from './ListContext';
import { useListContext } from './useListContext';

describe('useListContext', () => {
    const NaiveList = props => {
        const { data } = useListContext(props);
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

    it('should return injected props if the context was not set', () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        const { getByText } = render(
            <NaiveList resource="foo" data={[{ id: 1, title: 'hello' }]} />
        );
        expect(getByText('hello')).not.toBeNull();
    });
});
