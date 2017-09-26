import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import withChildrenAsFunction from './withChildrenAsFunction';

describe('WithChildrenAsFunction', () => {
    const DecoratedComponent = withChildrenAsFunction(<div />);

    it('passes through standard children (no function)', () => {
        const wrapper = shallow(
            <DecoratedComponent>
                <div id="1" />
                <div id="2" />
            </DecoratedComponent>
        );

        assert(wrapper.find(<div id="1" />));
        assert(wrapper.find(<div id="2" />));
    });

    it('passes through children returned by the function', () => {
        const wrapper = shallow(
            <DecoratedComponent>
                {() => [<div key="1" id="1" />, <div key="2" id="2" />]}
            </DecoratedComponent>
        );

        assert(wrapper.find(<div id="1" />));
        assert(wrapper.find(<div id="2" />));
    });

    it('passes through children resolved by the function', () => {
        const wrapper = shallow(
            <DecoratedComponent>
                {() =>
                    Promise.resolve([
                        <div key="1" id="1" />,
                        <div key="2" id="2" />,
                    ])}
            </DecoratedComponent>
        );

        assert(wrapper.find(<div id="1" />));
        assert(wrapper.find(<div id="2" />));
    });
});
