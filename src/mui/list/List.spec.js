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
        filters: {},
        total: 100,
        isLoading: false,
        crudGetList: () => {},
        push: () => {},
    };

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
                    filters={{}}
                >
                    <div />
                </List>
            );

            wrapper.setProps({ filters: { q: 'hello' } });
            clock.tick(1000); // wait for debounce
            wrapper.setProps({ filters: {} });
            clock.tick(1000); // wait for debounce

            assert.deepEqual(changeListParams.args, [
                ['post', { page: 1, filter: { q: 'hello' } }],
                ['post', { page: 1, filter: {} }],
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
