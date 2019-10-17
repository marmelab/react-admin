import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ReferenceArrayFieldView } from './ReferenceArrayField';
import TextField from './TextField';
import SingleFieldList from '../list/SingleFieldList';

describe('<ReferenceArrayField />', () => {
    afterEach(cleanup);
    it('should render a loading indicator when related records are not yet fetched', () => {
        const { queryAllByRole } = render(
            <ReferenceArrayFieldView
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={null}
                ids={[1, 2]}
                loaded={false}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceArrayFieldView>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(1);
    });

    it('should render a list of the child component', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ReferenceArrayFieldView
                    record={{ barIds: [1, 2] }}
                    resource="foo"
                    reference="bar"
                    source="barIds"
                    basePath=""
                    data={data}
                    ids={[1, 2]}
                    loaded={true}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).toBeDefined();
        expect(getByText('world')).toBeDefined();
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole, container } = render(
            <ReferenceArrayFieldView
                record={{ barIds: [1, 2] }}
                resource="foo"
                reference="bar"
                source="barIds"
                basePath=""
                data={{}}
                ids={[]}
                loaded={true}
            >
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceArrayFieldView>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).toBe('');
    });

    it('should support record with string identifier', () => {
        const data = {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ReferenceArrayFieldView
                    record={{ barIds: ['abc-1', 'abc-2'] }}
                    resource="foo"
                    reference="bar"
                    source="barIds"
                    basePath=""
                    data={data}
                    loaded={true}
                    ids={['abc-1', 'abc-2']}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).toBeDefined();
        expect(getByText('world')).toBeDefined();
    });

    it('should support record with number identifier', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { queryAllByRole, container, getByText } = render(
            <MemoryRouter>
                <ReferenceArrayFieldView
                    record={{ barIds: [1, 2] }}
                    resource="foo"
                    reference="bar"
                    source="barIds"
                    basePath=""
                    data={data}
                    loaded={true}
                    ids={[1, 2]}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </MemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild.textContent).not.toBeUndefined();
        expect(getByText('hello')).toBeDefined();
        expect(getByText('world')).toBeDefined();
    });

    it('should use custom className', () => {
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        const { container } = render(
            <MemoryRouter>
                <ReferenceArrayFieldView
                    record={{ barIds: [1, 2] }}
                    className="myClass"
                    resource="foo"
                    reference="bar"
                    source="barIds"
                    basePath=""
                    data={data}
                    ids={[1, 2]}
                    loaded={true}
                >
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceArrayFieldView>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('myClass')).toHaveLength(1);
    });
});
