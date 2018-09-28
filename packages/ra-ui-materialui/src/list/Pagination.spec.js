import React from 'react';
import { shallow } from 'enzyme';

import { Pagination } from './Pagination';

describe('<Pagination />', () => {
    it('should display a pagination limit when there is no result', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={0}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            1
        );
    });

    it('should not display a pagination limit when there are results', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={1}
                ids={[1]}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            0
        );
    });

    it('should not display a pagination limit on an out of bounds page', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={10}
                ids={[]}
                page={2}
                perPage={10}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            0
        );
    });

    describe('mobile', () => {
        it('should render a <TablePagination> without rowsPerPage choice', () => {
            const wrapper = shallow(
                <Pagination
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                />
            )
                .shallow()
                .shallow()
                .setProps({ width: 'xs' })
                .shallow()
                .shallow();
            const pagination = wrapper.find('WithStyles(TablePagination)');
            expect(pagination.prop('rowsPerPageOptions')).toEqual([]);
        });
    });
    describe('desktop', () => {
        it('should render a <TablePagination> with rowsPerPage choice', () => {
            const wrapper = shallow(
                <Pagination
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                    width={2}
                />
            )
                .shallow()
                .shallow()
                .shallow()
                .shallow();
            const pagination = wrapper.find('WithStyles(TablePagination)');
            expect(pagination.prop('rowsPerPageOptions')).toEqual([5, 10, 25]);
        });
    });
});
