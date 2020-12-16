import expect from 'expect';
import * as React from 'react';
import { render } from '@testing-library/react';

import { DatagridHeaderCell } from './DatagridHeaderCell';

describe('<DatagridHeaderCell />', () => {
    it('should accept a React element as Field label', () => {
        const Label = () => <>Label</>;
        const Field = () => <div />;
        const { getByText } = render(
            <table>
                <tbody>
                    <tr>
                        <DatagridHeaderCell
                            currentSort={{}}
                            field={<Field source="title" label={<Label />} />}
                            updateSort={() => true}
                        />
                    </tr>
                </tbody>
            </table>
        );
        expect(getByText('Label')).not.toBeNull();
    });

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
            expect(getByTitle('ra.action.sort').dataset.field).toBe('title');
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
            expect(getByTitle('ra.action.sort').dataset.field).toBe('title');
        });

        it('should be change order when field has a sortByOrder props', () => {
            const { getByTitle } = render(
                <table>
                    <tbody>
                        <tr>
                            <DatagridHeaderCell
                                currentSort={{}}
                                field={
                                    <Field sortBy="title" sortByOrder="DESC" />
                                }
                                updateSort={() => true}
                            />
                        </tr>
                    </tbody>
                </table>
            );
            expect(getByTitle('ra.action.sort').dataset.order).toBe('DESC');
        });

        it('should be keep ASC order when field has not sortByOrder props', () => {
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
            expect(getByTitle('ra.action.sort').dataset.order).toBe('ASC');
        });

        it('should be disabled when field has no sortBy and no source', () => {
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
