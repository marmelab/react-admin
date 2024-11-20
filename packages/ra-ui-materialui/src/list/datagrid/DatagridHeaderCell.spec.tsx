import expect from 'expect';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourceContextProvider } from 'ra-core';

import { DatagridHeaderCell } from './DatagridHeaderCell';
import { LabelElements } from './Datagrid.stories';

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
        render(
            <Wrapper>
                <DatagridHeaderCell
                    sort={{ field: 'title', order: 'ASC' }}
                    field={<Field source="title" label={<Label />} />}
                    updateSort={() => true}
                />
            </Wrapper>
        );
        expect(screen.getByText('Label')).not.toBeNull();
    });
    it('should use the default inferred field label in its tooltip when using a React element as the field label', async () => {
        render(<LabelElements />);
        await screen.findByText('ID');
        await screen.findByLabelText('Sort by id descending');
        await screen.findByText('TITLE');
        await screen.findByLabelText('Sort by title ascending');
        await screen.findByText('AUTHOR');
        await screen.findByLabelText('Sort by author ascending');
        await screen.findByText('YEAR');
        await screen.findByLabelText('Sort by year ascending');
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
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.getByLabelText('ra.action.sort').dataset.field).toBe(
                'title'
            );
        });

        it('should be enabled when field has a sortBy props', () => {
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field sortBy="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.getByLabelText('ra.action.sort').dataset.field).toBe(
                'title'
            );
        });

        it('should be change order when field has a sortByOrder props', () => {
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field sortBy="title" sortByOrder="DESC" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.getByLabelText('ra.action.sort').dataset.order).toBe(
                'DESC'
            );
        });

        it('should be keep ASC order when field has not sortByOrder props', () => {
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.getByLabelText('ra.action.sort').dataset.order).toBe(
                'ASC'
            );
        });

        it('should be disabled when field has no sortBy and no source', () => {
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.queryAllByLabelText('ra.action.sort')).toHaveLength(
                0
            );
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            render(
                <Wrapper>
                    <DatagridHeaderCell
                        sort={{ field: 'title', order: 'ASC' }}
                        field={<Field source="title" sortable={false} />}
                        updateSort={() => true}
                    />
                </Wrapper>
            );
            expect(screen.queryAllByLabelText('ra.action.sort')).toHaveLength(
                0
            );
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
