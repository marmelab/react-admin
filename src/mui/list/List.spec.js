import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { List } from './List';

describe('<List />', () => {
    const defaultProps = {
        resource: 'post',
        hasCreate: false,
        hasEdit: false,
        location: {},
        params: {},
        query: {},
        filterValues: {},
        total: 100,
        isLoading: false,
        crudGetList: () => {},
        push: () => {},
        translate: () => {},
    };

    it('should display a no results text when there is no result', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                children={[]}
                total={0}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper.find('CardText').children();
        assert.equal(textElement.text(), 'aor.navigation.no_results');
    });

    it('should not display a no results text when there are results', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                children={[ 'not_empty' ]}
                total={1}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper.find('CardText');
        assert.equal(textElement.length, 0);
    });

    describe('Filters', () => {
        let clock;
        beforeEach(() => {
            clock = sinon.useFakeTimers();
        });

        it('should call `changeListParams` prop function for each filter change', () => {
            const changeListParams = sinon.spy();
            const wrapper = shallow(
                <List
                    {...defaultProps}
                    changeListParams={changeListParams}
                    filterValues={{}}
                >
                    <div />
                </List>
            );

            wrapper.setProps({ filterValues: { q: 'hello' } });
            clock.tick(1000); // wait for debounce
            wrapper.setProps({ filterValues: {} });
            clock.tick(1000); // wait for debounce

            assert.deepEqual(changeListParams.args, [
                ['post', { page: 1, perPage: 10, sort: 'id', order: 'DESC', filter: { q: 'hello' } }],
                ['post', { page: 1, perPage: 10, sort: 'id', order: 'DESC', filter: {} }],
            ]);
        });

        it('should call `changeFormValue` prop function when a filter is removed (hidden)', () => {
            const changeListParams = sinon.spy();
            const changeFormValue = sinon.spy();
            const wrapper = shallow(
                <List
                    {...defaultProps}
                    changeListParams={changeListParams}
                    changeFormValue={changeFormValue}
                >
                    <div />
                </List>
            );

            wrapper.instance().hideFilter('q');

            assert.deepEqual(changeFormValue.args, [
                ['filterForm', 'q', ''],
            ]);
        });

        afterEach(() => {
            if (clock) {
                clock.restore();
            }
        });
    });
});
