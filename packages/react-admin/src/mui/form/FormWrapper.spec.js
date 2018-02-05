import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import FormWrapper from './FormWrapper';

describe('<FormWrapper />', () => {
    it('should render a html form by default', () => {
        const wrapper = shallow(<FormWrapper />).dive();
        assert.equal(wrapper.matchesElement(<form />), true);
    });
    it('should pass additional props', () => {
        const wrapper = shallow(<FormWrapper method="post" />).dive();
        assert.equal(wrapper.matchesElement(<form method="post" />), true);
    });
    it('should wrap children with render func', () => {
        const wrapper = shallow(
            <FormWrapper
                render={(defaultRenderer, props) => (
                    <div>{defaultRenderer(props)}</div>
                )}
            >
                <div>Layout</div>
            </FormWrapper>
        );
        assert.equal(
            wrapper.matchesElement(
                <div>
                    <form>
                        <div>Layout</div>
                    </form>
                </div>
            ),
            true
        );
    });

    describe('defaultRender prop', () => {
        it('should supply defaultRenderer prop', () => {
            const wrapper = shallow(
                <FormWrapper render={defaultRenderer => defaultRenderer()} />
            );
            assert.equal(wrapper.matchesElement(<form />), true);
        });
        it('should pass additional props', () => {
            const wrapper = shallow(
                <FormWrapper
                    render={defaultRenderer =>
                        defaultRenderer({ method: 'post' })}
                />
            );
            assert.equal(wrapper.matchesElement(<form method="post" />), true);
        });
    });
});
