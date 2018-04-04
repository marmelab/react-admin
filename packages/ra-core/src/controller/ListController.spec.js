import React from 'react';
import { shallow } from 'enzyme';
import lolex from 'lolex';
import { setDisplayName } from 'recompose';

import { ListController } from './ListController';
import TextField from 'material-ui/TextField/TextField';

describe('ListController', () => {
    const defaultProps = {
        changeListParams: () => {},
        children: () => {},
        crudGetList: () => {},
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        ids: [],
        isLoading: false,
        location: {
            pathname: '',
        },
        params: {},
        push: () => {},
        query: {},
        resource: '',
        setSelectedIds: () => {},
        toggleItem: () => {},
        total: 100,
        translate: () => {},
    };

    describe('setFilters', () => {
        let clock;
        let fakeComponent;

        beforeEach(() => {
            clock = lolex.install();
            fakeComponent = setDisplayName(
                'FakeComponent' // for eslint
            )(({ setFilters }) => <TextField onChange={setFilters} />);
        });

        it('should take only last change in case of a burst of changes (case of inputs being currently edited)', () => {
            const props = {
                ...defaultProps,
                debounce: 200,
                changeListParams: jest.fn(),
                children: fakeComponent,
            };

            const wrapper = shallow(<ListController {...props} />);
            const onChange = wrapper.find(TextField).prop('onChange');

            onChange({ q: 'hel' });
            onChange({ q: 'hell' });
            onChange({ q: 'hello' });

            clock.tick(200);

            const changeListParamsCalls = props.changeListParams.mock.calls;

            expect(changeListParamsCalls.length).toBe(1);
            expect(changeListParamsCalls[0][1].filter).toEqual({ q: 'hello' });
        });

        it('should not call filtering function if filters are unchanged', () => {
            const props = {
                ...defaultProps,
                debounce: 200,
                changeListParams: jest.fn(),
                filterValues: { q: 'hello' },
                children: fakeComponent,
            };

            const wrapper = shallow(<ListController {...props} />);
            const onChange = wrapper.find(TextField).prop('onChange');

            onChange({ q: 'hello' });
            clock.tick(200);

            expect(props.changeListParams).not.toHaveBeenCalled();
        });

        it('should remove empty filters', () => {
            const props = {
                ...defaultProps,
                debounce: 200,
                changeListParams: jest.fn(),
                filterValues: { q: 'hello' },
                children: fakeComponent,
            };

            const wrapper = shallow(<ListController {...props} />);
            const onChange = wrapper.find(TextField).prop('onChange');

            onChange({ q: '' });
            clock.tick(200);

            expect(props.changeListParams.mock.calls[0][1].filter).toEqual({});
        });

        afterEach(() => {
            clock.uninstall();
        });
    });
});
