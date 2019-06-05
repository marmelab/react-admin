import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { Responsive } from './Responsive';

describe('<Responsive>', () => {
    const Small = () => <div />;
    const Medium = () => <div />;
    const Large = () => <div />;

    it('should render the small component on small screens', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={<Medium />} large={<Large />} width="xs" />);
        const component = wrapper.find('Small');
        assert.equal(component.length, 1);
    });
    it('should render the small component on small screens and small is null', () => {
        const wrapper = shallow(<Responsive small={null} medium={<Medium />} large={<Large />} width="xs" />);
        assert.equal(wrapper.get(0), null);
    });
    it('should render the medium component on medium screens', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={<Medium />} large={<Large />} width="md" />);
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
    it('should render the medium component on medium screens and medium is null', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={null} large={<Large />} width="md" />);
        assert.equal(wrapper.get(0), null);
    });
    it('should render the large component on large screens', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={<Medium />} large={<Large />} width="lg" />);
        const component = wrapper.find('Large');
        assert.equal(component.length, 1);
    });
    it('should render the large component on large screens and large is null', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={<Medium />} large={null} width="lg" />);
        assert.equal(wrapper.get(0), null);
    });
    it('should render the small component on all screens when no other component is passed', () => {
        assert.equal(shallow(<Responsive small={<Small />} width="xs" />).find('Small').length, 1);
        assert.equal(shallow(<Responsive small={<Small />} width="sm" />).find('Small').length, 1);
        assert.equal(shallow(<Responsive small={<Small />} width="lg" />).find('Small').length, 1);
    });
    it('should render the medium component on all screens when no other component is passed', () => {
        assert.equal(shallow(<Responsive medium={<Medium />} width="xs" />).find('Medium').length, 1);
        assert.equal(shallow(<Responsive medium={<Medium />} width="sm" />).find('Medium').length, 1);
        assert.equal(shallow(<Responsive medium={<Medium />} width="lg" />).find('Medium').length, 1);
    });
    it('should render the large component on all screens when no other component is passed', () => {
        assert.equal(shallow(<Responsive large={<Large />} width="xs" />).find('Large').length, 1);
        assert.equal(shallow(<Responsive large={<Large />} width="sm" />).find('Large').length, 1);
        assert.equal(shallow(<Responsive large={<Large />} width="lg" />).find('Large').length, 1);
    });
    it('should fallback to the large component on medium screens', () => {
        const wrapper = shallow(<Responsive small={<Small />} large={<Large />} width="md" />);
        const component = wrapper.find('Large');
        assert.equal(component.length, 1);
    });
    it('should fallback to the medium component on small screens', () => {
        const wrapper = shallow(<Responsive medium={<Medium />} large={<Large />} width="sm" />);
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
    it('should fallback to the medium component on large screens', () => {
        const wrapper = shallow(<Responsive small={<Small />} medium={<Medium />} width="lg" />);
        const component = wrapper.find('Medium');
        assert.equal(component.length, 1);
    });
});
