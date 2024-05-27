import expect from 'expect';
import * as React from 'react';
import { render } from '@testing-library/react';

import { DatagridHeaderCell } from './DatagridHeaderCell';
import { ResourceContextProvider } from 'ra-core';

const Wrapper = ({ children }) => (
    <table>
        <tbody>
            <tr>
                <ResourceContextProvider value="posts">
                    {children}
                </ResourceContextProvider>
            </tr>
        </tbody>
    </table>
);

describe('<DatagridHeaderCell />', () => {
    it('should accept a React element as Field label', () => {
        const Label = () => <>Label</>;
        const Field = (_props: {
            source?: string;
            label?: React.ReactNode;
        }) => <div />;
        const { getByText } = render(
            <Wrapper>
                <DatagridHeaderCell
                    sort={{ field: 'title', order: 'ASC' }}
                    field={<Field source="title" label={<Label />} />}
                    updateSort={() => true}
                />
            </Wrapper>
        );
        expect(getByText('Label')).not.toBeNull();
    });

    describe('sorting on a column', () => {
        const Field = (_props: {
            source?: string;
            sortBy?: string;
            sortByOrder?: string;
            label?: string;
            sortable?: boolean;
        }) => <div />;
        Field.defaultProps = {
            type: 'foo',
            updateSort: () => true,
        };

        it('should be enabled when field has a source', () => {
            const { getByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(getByLabelText('ra.action.sort').dataset.field).toBe(
                'title'
            );
        });

        it('should be enabled when field has a sortBy props', () => {
            const { getByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field sortBy="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(getByLabelText('ra.action.sort').dataset.field).toBe(
                'title'
            );
        });

        it('should be change order when field has a sortByOrder props', () => {
            const { getByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field sortBy="title" sortByOrder="DESC" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(getByLabelText('ra.action.sort').dataset.order).toBe('DESC');
        });

        it('should be keep ASC order when field has not sortByOrder props', () => {
            const { getByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(getByLabelText('ra.action.sort').dataset.order).toBe('ASC');
        });

        it('should be disabled when field has no sortBy and no source', () => {
            const { queryAllByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(queryAllByLabelText('ra.action.sort')).toHaveLength(0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const { queryAllByLabelText } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" sortable={false} />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(queryAllByLabelText('ra.action.sort')).toHaveLength(0);
        });

        it('should use cell className if specified', () => {
            const { container } = render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        updateSort={() => true}
                        field={<Field />}
                        className="blue"
                    />
                </Wrapper>
            );
            expect(container.querySelector('td')?.className).toContain('blue');
        });
    });
});
