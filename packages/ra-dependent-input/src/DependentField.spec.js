import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import {
    DependentFieldComponent as DependentField,
    mapStateToProps,
} from './DependentField';

describe('mapStateToProps', () => {
    describe('with resolve function', () => {
        test('returns { show: false } if the resolve returns false', () => {
            const resolve = jest.fn(() => false);
            expect(mapStateToProps({}, { resolve })).toEqual({ show: false });
        });

        test('returns { show: true } if the resolve returns true', () => {
            const resolve = jest.fn(() => true);
            expect(mapStateToProps({}, { resolve })).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as a string', () => {
        test('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    lastName: 'blublu',
                                },
                            },
                        },
                    },
                    {
                        dependsOn: 'firstName',
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: 'firstName',
                        record: {
                            firstName: 'blublu',
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as a deep path string', () => {
        test('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: 'author.firstName',
                        record: {
                            author: {
                                lastName: 'blublu',
                            },
                        },
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: 'author.firstName',
                        record: {
                            author: {
                                firstName: 'blublu',
                            },
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as a string and a specific value', () => {
        test('returns { show: false } if the form does not have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: 'firstName',
                        value: 'foo',
                        record: {
                            firstName: 'bar',
                        },
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: 'firstName',
                        value: 'foo',
                        record: {
                            firstName: 'foo',
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as an array', () => {
        test('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['firstName', 'lastName'],
                        record: {
                            lastName: 'blublu',
                        },
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['firstName', 'lastName'],
                        record: {
                            firstName: 'blublu',
                            lastName: 'blublu',
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as an array with deep path strings', () => {
        test('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'date'],
                        record: {
                            date: new Date().toDateString(),
                            author: {
                                lastName: 'blublu',
                            },
                        },
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'date'],
                        record: {
                            date: new Date().toDateString(),
                            author: {
                                firstName: 'blublu',
                            },
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as an array and specific values as an array', () => {
        test('returns { show: false } if the form does not have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'category'],
                        record: {
                            category: 'bar',
                            author: {
                                firstName: 'bar',
                            },
                        },
                        value: ['foo', 'bar'],
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the form have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'category'],
                        record: {
                            category: 'bar',
                            author: {
                                firstName: 'foo',
                            },
                        },
                        value: ['foo', 'bar'],
                    }
                )
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as an array and resolve', () => {
        test('returns { show: false } if the resolve function returns false', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'category'],
                        record: {
                            category: 'bar',
                            author: {
                                firstName: 'bar',
                                lastName: 'bar',
                            },
                        },
                        resolve: values => {
                            return (
                                values.author.firstName === 'foo' &&
                                values.category === 'bar'
                            );
                        },
                    }
                )
            ).toEqual({ show: false });
        });

        test('returns { show: true } if the resolve function returns true', () => {
            expect(
                mapStateToProps(
                    {},
                    {
                        dependsOn: ['author.firstName', 'category'],
                        record: {
                            category: 'bar',
                            author: {
                                firstName: 'foo',
                                lastName: 'bar',
                            },
                        },
                        resolve: values => {
                            return (
                                values.author.firstName === 'foo' &&
                                values.category === 'bar'
                            );
                        },
                    }
                )
            ).toEqual({ show: true });
        });
    });
});

describe('<DependentField />', () => {
    test('returns null when show prop is false', () => {
        const wrapper = shallow(
            <DependentField show={false}>
                <span />
            </DependentField>
        );
        expect(wrapper.type() === null);
    });

    test('returns a unique FormField element when passed a unique child', () => {
        const wrapper = shallow(
            <DependentField show={true}>
                <span source="aSource" />
            </DependentField>
        );

        expect(wrapper.name()).toEqual('div');
        expect(wrapper.prop('className')).toEqual('aor-input-aSource');
        const formFields = wrapper.find('Connect(FormField)');
        expect(formFields.length).toEqual(1);
        expect(formFields.at(0).prop('input')).toEqual(
            <span source="aSource" />
        );
    });

    test('returns a span with FormField children for each passed child', () => {
        const wrapper = shallow(
            <DependentField show={true}>
                <span className="1" />
                <span className="2" />
                <span className="3" />
            </DependentField>
        );

        expect(wrapper.at(0).type()).toEqual('div');
        const formFields = wrapper.find('Connect(FormField)');
        expect(formFields.length).toEqual(3);

        expect(formFields.at(0).prop('input')).toEqual(<span className="1" />);
        expect(formFields.at(1).prop('input')).toEqual(<span className="2" />);
        expect(formFields.at(2).prop('input')).toEqual(<span className="3" />);
    });
});
