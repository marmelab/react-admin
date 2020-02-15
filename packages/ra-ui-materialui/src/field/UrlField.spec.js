import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import UrlField from './UrlField';

describe('<UrlField />', () => {
    it('should display a link', () => {
        const record = { website: 'https://en.wikipedia.org/wiki/HAL_9000' };
        const wrapper = shallow(<UrlField record={record} source="website" />);
        assert.equal(
            wrapper.html(),
            '<a href="https://en.wikipedia.org/wiki/HAL_9000">https://en.wikipedia.org/wiki/HAL_9000</a>'
        );
    });

    it('should handle deep fields', () => {
        const record = {
            foo: { website: 'https://en.wikipedia.org/wiki/HAL_9000' },
        };
        const wrapper = shallow(
            <UrlField record={record} source="foo.website" />
        );
        assert.equal(
            wrapper.html(),
            '<a href="https://en.wikipedia.org/wiki/HAL_9000">https://en.wikipedia.org/wiki/HAL_9000</a>'
        );
    });

    it('should render the emptyText when value is null', () => {
        const { queryByText } = render(
            <UrlField
                record={{ url: null }}
                className="foo"
                source="url"
                emptyText="NA"
            />
        );
        assert.notEqual(queryByText('NA'), null);
    });
});
