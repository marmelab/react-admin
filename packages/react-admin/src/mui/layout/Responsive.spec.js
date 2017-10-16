import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { Responsive } from './Responsive';

describe('<Responsive>', () => {
    const Small = () => <div />;
    const Medium = () => <div />;
    const Large = () => <div />;

    it('should render the small component on small screens', () => {
        const wrapper = shallow(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width={1}
            />
        );
        const component = wrapper.find('Small');
        assert.equal(component.length, 1);
    });
    it('should render the medium component on medium screens', () => {
        const wrapper = shallow(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width={2}
            />
        );
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
    it('should render the large component on large screens', () => {
        const wrapper = shallow(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width={3}
            />
        );
        const component = wrapper.find('Large');
        assert.equal(component.length, 1);
    });
    it('should render the small component on all screens when no other component is passed', () => {
        assert.equal(
            shallow(<Responsive small={<Small />} width={1} />).find('Small')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive small={<Small />} width={2} />).find('Small')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive small={<Small />} width={3} />).find('Small')
                .length,
            1
        );
    });
    it('should render the medium component on all screens when no other component is passed', () => {
        assert.equal(
            shallow(<Responsive medium={<Medium />} width={1} />).find('Medium')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive medium={<Medium />} width={2} />).find('Medium')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive medium={<Medium />} width={3} />).find('Medium')
                .length,
            1
        );
    });
    it('should render the large component on all screens when no other component is passed', () => {
        assert.equal(
            shallow(<Responsive large={<Large />} width={1} />).find('Large')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive large={<Large />} width={2} />).find('Large')
                .length,
            1
        );
        assert.equal(
            shallow(<Responsive large={<Large />} width={3} />).find('Large')
                .length,
            1
        );
    });
    it('should fallback to the large component on medium screens', () => {
        const wrapper = shallow(
            <Responsive small={<Small />} large={<Large />} width={2} />
        );
        const component = wrapper.find('Large');
        assert.equal(component.length, 1);
    });
    it('should fallback to the medium component on small screens', () => {
        const wrapper = shallow(
            <Responsive medium={<Medium />} large={<Large />} width={1} />
        );
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
    it('should fallback to the medium component on large screens', () => {
        const wrapper = shallow(
            <Responsive small={<Small />} medium={<Medium />} width={3} />
        );
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
});
