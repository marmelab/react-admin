import expect from 'expect';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { DatagridHeaderCell } from './DatagridHeaderCell';

describe('<DatagridHeaderCell />', () => {
    afterEach(cleanup);

    describe('sorting on a column', () => {
        const Field = () => <div />;
        Field.defaultProps = {
            type: 'foo',
            updateSort: () => true,
        };

        it('should be enabled when field has a source', () => {
            const { getByTitle } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                field={<Field source="title" />}
                                updateSort={() => true}
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(getByTitle('ra.action.sort').dataset.sort).toBe('title');
        });

        it('should be enabled when field has a sortBy props', () => {
            const { getByTitle } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                field={<Field sortBy="title" />}
                                updateSort={() => true}
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(getByTitle('ra.action.sort').dataset.sort).toBe('title');
        });

        it('should be disabled when field has no sortby and no source', () => {
            const { queryAllByTitle } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                field={<Field />}
                                updateSort={() => true}
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(queryAllByTitle('ra.action.sort')).toHaveLength(0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const { queryAllByTitle } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                field={
                                    <Field source="title" sortable={false} />
                                }
                                updateSort={() => true}
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(queryAllByTitle('ra.action.sort')).toHaveLength(0);
        });

        it('should use cell className if specified', () => {
            const { container } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                updateSort={() => true}
                                field={<Field />}
                                className="blue"
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(container.querySelector('td').className).toContain('blue');
        });
    });
});
