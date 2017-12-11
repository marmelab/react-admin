import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import FunctionField from './FunctionField';

describe('<FunctionField />', () => {
    it('should render using the render function', () => {
        const record = { foo: 'bar' };
        const wrapper = shallow(
            <FunctionField
                record={record}
                render={r => r['foo'].substr(0, 2)}
            />
        );
        assert.equal(wrapper.html(), '<span>ba</span>');
    });
});
