import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ReferenceArrayInput } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const InlineForm = () => <span id="inlineform" />;
    const defaultProps = {
        crudGetMatching: () => true,
        crudGetMany: () => true,
        input: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        openedFormsCount: 1,
        inlineFormsData: {},
        allowEmpty: true,
        incrementOpenedForms: () => true,
        decrementOpenedForms: () => true,
        crudCreateInline: () => true,
        inlineForm: <InlineForm />,
        record: {},
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should not render anything if there is no referenceRecord and allowEmpty is false', () => {
        const wrapper = shallow((
            <ReferenceArrayInput {...defaultProps} allowEmpty={false}>
                <MyComponent />
            </ReferenceArrayInput>
        ));
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
    });

    it('should not render enclosed component if allowEmpty is true', () => {
        const wrapper = shallow((
            <ReferenceArrayInput {...defaultProps} allowEmpty>
                <MyComponent />
            </ReferenceArrayInput>
        ));
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
    });

    it('should call crudGetMatching on mount with default fetch values', () => {
        const crudGetMatching = sinon.spy();
        shallow((
            <ReferenceArrayInput {...defaultProps} allowEmpty crudGetMatching={crudGetMatching}>
                <MyComponent />
            </ReferenceArrayInput>
        ), { lifecycleExperimental: true });
        assert.deepEqual(crudGetMatching.args[0], [
            'tags',
            'posts@tag_ids',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {},
        ]);
    });

    it('should allow to customize crudGetMatching arguments with perPage, sort, and filter props', () => {
        const crudGetMatching = sinon.spy();
        shallow((
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                sort={{ field: 'foo', order: 'ASC' }}
                perPage={5}
                filter={{ q: 'foo' }}
            >
                <MyComponent />
            </ReferenceArrayInput>
        ), { lifecycleExperimental: true });
        assert.deepEqual(crudGetMatching.args[0], [
            'tags',
            'posts@tag_ids',
            {
                page: 1,
                perPage: 5,
            },
            {
                field: 'foo',
                order: 'ASC',
            },
            {
                q: 'foo',
            },
        ]);
    });

    it('should call crudGetMatching when setFilter is called', () => {
        const crudGetMatching = sinon.spy();
        const wrapper = shallow((
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
            >
                <MyComponent />
            </ReferenceArrayInput>
        ), { lifecycleExperimental: true });
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.args[1], [
            'tags',
            'posts@tag_ids',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {
                q: 'bar',
            },
        ]);
    });

    it('should use custom filterToQuery function prop', () => {
        const crudGetMatching = sinon.spy();
        const wrapper = shallow((
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMatching={crudGetMatching}
                filterToQuery={searchText => ({ foo: searchText })}
            >
                <MyComponent />
            </ReferenceArrayInput>
        ), { lifecycleExperimental: true });
        wrapper.instance().setFilter('bar');
        assert.deepEqual(crudGetMatching.args[1], [
            'tags',
            'posts@tag_ids',
            {
                page: 1,
                perPage: 25,
            },
            {
                field: 'id',
                order: 'DESC',
            },
            {
                foo: 'bar',
            },
        ]);
    });

    it('should call crudGetMany on mount if value is set', () => {
        const crudGetMany = sinon.spy();
        shallow((
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                crudGetMany={crudGetMany}
                input={{ value: [5, 6] }}
            >
                <MyComponent />
            </ReferenceArrayInput>
        ), { lifecycleExperimental: true });
        assert.deepEqual(crudGetMany.args[0], [
            'tags',
            [5, 6],
        ]);
    });

    it('should pass onChange down to child component', () => {
        const onChange = sinon.spy();
        const wrapper = shallow((
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInput>
        ));
        wrapper.find('MyComponent').simulate('change', 'foo');
        assert.deepEqual(onChange.args[0], [
            'foo',
        ]);
    });

    it('should pass meta down to child component', () => {
        const wrapper = shallow(
            <ReferenceArrayInput
                {...defaultProps}
                allowEmpty
                meta={{ touched: false }}
            >
                <MyComponent />
            </ReferenceArrayInput>,
        );

        const myComponent = wrapper.find('MyComponent');
        assert.notEqual(myComponent.prop('meta', undefined));
    });


    describe('inline forms behavior', () => {
        const getWrapper = props => shallow((
            <ReferenceArrayInput
                {...defaultProps}
                {...props}
            >
                <MyComponent />
            </ReferenceArrayInput>
            ));

        it('should not render Dialog if there is no inlineForm', () => {
            const wrapper = getWrapper({ inlineForm: null });
            const Dialog = wrapper.find('Dialog');
            assert.equal(Dialog.length, 0);
        });

        it('should render Dialog if there is an inlineForm', () => {
            const wrapper = getWrapper();
            const Dialog = wrapper.find('Dialog');
            assert.equal(Dialog.length, 1);
        });

        it('should render inlineForm inside Dialog', () => {
            const wrapper = getWrapper();
            const Form = wrapper.find('Dialog InlineForm');
            assert.equal(Form.length, 1);
        });

        it('should pass onCreateInline handler to child component if there is an inlineForm', () => {
            const wrapper = getWrapper();
            const child = wrapper.find(MyComponent);
            assert.equal(typeof child.prop('onCreateInline'), 'function');
        });

        it('should not pass onCreateInline handler to child component if there is no inlineForm', () => {
            const wrapper = getWrapper({ inlineForm: null });
            const child = wrapper.find(MyComponent);
            assert.equal(child.prop('onCreateInline'), null);
        });

        it('should show Dialog when child calls onCreateInline handler', () => {
            const wrapper = getWrapper();
            wrapper.find(MyComponent).simulate('createInline');
            assert.equal(wrapper.state('showCreateDialog'), true);
        });

        it('should pass onSubmit handler to inlineForm', () => {
            const wrapper = getWrapper();
            const form = wrapper.find(InlineForm);
            assert.equal(typeof form.prop('onSubmit'), 'function');
        });

        it('should have a formId that depends on openedFormsCount', () => {
            const wrapper = getWrapper({ openedFormsCount: 2 });
            const formId = wrapper.instance().formId;
            assert.equal(formId, 'posts@tag_ids@2');
        });

        describe('.handleCreateInline', () => {
            it('should call incrementOpenedForms', () => {
                const incrementOpenedForms = sinon.spy();
                const wrapper = getWrapper({ incrementOpenedForms });
                wrapper.instance().handleCreateInline();
                assert(incrementOpenedForms.calledOnce);
            });

            it('should show Dialog', () => {
                const wrapper = getWrapper();
                wrapper.setState({ showCreateDialog: false });
                wrapper.instance().handleCreateInline();
                assert(wrapper.state('showCreateDialog'));
            });

            it('should store a reference to the callback received', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const callback = () => true;
                instance.handleCreateInline(null, callback);
                assert.equal(instance.recordCreatedCB, callback);
            });

            it('should store the partial record received in state', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                instance.handleCreateInline({ id: 1, name: 'some tag' });
                assert.deepEqual(wrapper.state('inlineRecord'), { id: 1, name: 'some tag' });
            });
        });

        describe('.handleInlineFormSubmit', () => {
            const crudCreateInline = sinon.spy();
            const wrapper = getWrapper({ crudCreateInline });

            it('should call crudCreateInline with record', () => {
                const instance = wrapper.instance();
                instance.handleInlineFormSubmit({ id: 1, name: 'some tag' });
                assert.deepEqual(crudCreateInline.args[0], [
                    'tags',
                    {
                        id: 1,
                        name: 'some tag',
                    },
                    'posts@tag_ids@1',
                ]);
            });
        });

        describe('.handleRequestCloseDialog', () => {
            it('should call closeDialog if this is the top-level form', () => {
                const wrapper = getWrapper({ openedFormsCount: 0 });
                const closeDialog = sinon.spy();
                const instance = wrapper.instance();

                wrapper.setProps({ openedFormsCount: 1 });
                instance.closeDialog = closeDialog;
                instance.handleRequestCloseDialog();
                assert(closeDialog.calledOnce);
            });

            it('should not call closeDialog if this is not the top-level form', () => {
                const wrapper = getWrapper({ openedFormsCount: 0 });
                const closeDialog = sinon.spy();
                const instance = wrapper.instance();

                wrapper.setProps({ openedFormsCount: 2 });
                instance.closeDialog = closeDialog;
                instance.handleRequestCloseDialog();
                assert(closeDialog.notCalled);
            });
        });

        describe('.closeDialog', () => {
            it('should call decrementOpenedForms', () => {
                const decrementOpenedForms = sinon.spy();
                const instance = getWrapper({ decrementOpenedForms }).instance();
                instance.closeDialog();
                assert(decrementOpenedForms.calledOnce);
            });

            it('should close dialog', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                wrapper.setState({
                    showCreateDialog: true,
                });
                instance.closeDialog();
                assert.equal(wrapper.state('showCreateDialog'), false);
            });
        });

        describe('when there is a new created record', () => {
            it('should call the stored callback with the new record', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const callback = sinon.spy();
                const inlineFormsData = { [instance.formId]: { id: 1, name: 'some tag' } };
                instance.recordCreatedCB = callback;
                wrapper.setProps({ inlineFormsData });
                assert(callback.calledWith({ id: 1, name: 'some tag' }));
            });

            it('should close Dialog', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const inlineFormsData = { [instance.formId]: { id: 1, name: 'some tag' } };
                wrapper.setState({ showCreateDialog: true });
                wrapper.setProps({ inlineFormsData });
                assert.equal(wrapper.state('showCreateDialog'), false);
            });
        });
    });
});
