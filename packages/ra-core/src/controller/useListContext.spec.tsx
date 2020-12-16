import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import ListContext from './ListContext';
import useListContext from './useListContext';

describe('useListContext', () => {
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
            <ListContext.Provider
                // @ts-ignore
                value={{
                    resource: 'foo',
                    ids: [1],
                    data: { 1: { id: 1, title: 'hello' } },
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
            <NaiveList
                resource="foo"
                ids={[1]}
                data={{ 1: { id: 1, title: 'hello' } }}
            />
        );
        expect(getByText('hello')).not.toBeNull();
    });
});
