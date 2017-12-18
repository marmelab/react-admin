import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import {
    DependentInputComponent as DependentInput,
    mapStateToProps,
} from './DependentInput';

describe('mapStateToProps', () => {
    describe('with resolve function', () => {
        test('returns { show: false } if the resolve returns false', () => {
            const resolve = jest.fn(() => false);
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
                    { resolve }
                )
            ).toEqual({
                show: false,
                dependsOnValue: {
                    lastName: 'blublu',
                },
            });
        });

        test('returns { show: true } if the resolve returns true', () => {
            const resolve = jest.fn(() => true);
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
                    { resolve }
                )
            ).toEqual({
                show: true,
                dependsOnValue: {
                    lastName: 'blublu',
                },
            });
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
            ).toEqual({ show: false, dependsOnValue: undefined });
        });

        test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName' }
                )
            ).toEqual({ show: true, dependsOnValue: 'blublu' });
        });
    });

    describe('with only dependsOn specified as a deep path string', () => {
        test('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: 'author.firstName' }
                )
            ).toEqual({ show: false, dependsOnValue: undefined });
        });

        test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: 'author.firstName' }
                )
            ).toEqual({ show: true, dependsOnValue: 'blublu' });
        });
    });

    describe('with dependsOn specified as a string and a specific value', () => {
        test('returns { show: false } if the form does not have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', value: 'foo' }
                )
            ).toEqual({ show: false, dependsOnValue: 'bar' });
        });

        test('returns { show: true } if the form have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', value: 'foo' }
                )
            ).toEqual({ show: true, dependsOnValue: 'foo' });
        });
    });

    describe('with dependsOn specified as a string and resolve', () => {
        test('returns { show: false } if the resolve function returns false', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    },
                    {
                        dependsOn: 'firstName',
                        resolve: value => value === 'foo',
                    }
                )
            ).toEqual({ show: false, dependsOnValue: 'bar' });
        });

        test('returns { show: true } if the resolve function returns true', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    },
                    {
                        dependsOn: 'firstName',
                        resolve: value => value === 'foo',
                    }
                )
            ).toEqual({ show: true, dependsOnValue: 'foo' });
        });
    });

    describe('with only dependsOn specified as an array', () => {
        test('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
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
                    { dependsOn: ['firstName', 'lastName'] }
                )
            ).toEqual({
                show: false,
                dependsOnValue: {
                    lastName: 'blublu',
                },
            });
        });

        test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                    lastName: 'blublu',
                                },
                            },
                        },
                    },
                    { dependsOn: ['firstName', 'lastName'] }
                )
            ).toEqual({
                show: true,
                dependsOnValue: {
                    firstName: 'blublu',
                    lastName: 'blublu',
                },
            });
        });
    });

    describe('with only dependsOn specified as an array with deep path strings', () => {
        const date = new Date().toDateString();

        test('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    date,
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: ['author.firstName', 'date'] }
                )
            ).toEqual({
                show: false,
                dependsOnValue: { date },
            });
        });

        test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    date,
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: ['author.firstName', 'date'] }
                )
            ).toEqual({
                show: true,
                dependsOnValue: {
                    date,
                    author: {
                        firstName: 'blublu',
                    },
                },
            });
        });
    });

    describe('with dependsOn specified as an array and specific values as an array', () => {
        test('returns { show: false } if the form does not have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'bar',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        value: ['foo', 'bar'],
                    }
                )
            ).toEqual({
                show: false,
                dependsOnValue: {
                    category: 'bar',
                    author: {
                        firstName: 'bar',
                    },
                },
            });
        });

        test('returns { show: true } if the form have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'foo',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        value: ['foo', 'bar'],
                    }
                )
            ).toEqual({
                show: true,
                dependsOnValue: {
                    category: 'bar',
                    author: {
                        firstName: 'foo',
                    },
                },
            });
        });
    });

    describe('with dependsOn specified as an array and resolve', () => {
        test('returns { show: false } if the resolve function returns false', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'bar',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        resolve: values => {
                            return (
                                values.author.firstName === 'foo' &&
                                values.category === 'bar'
                            );
                        },
                    }
                )
            ).toEqual({
                show: false,
                dependsOnValue: {
                    category: 'bar',
                    author: {
                        firstName: 'bar',
                    },
                },
            });
        });

        test('returns { show: true } if the resolve function returns true', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'foo',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        resolve: values => {
                            return (
                                values.author.firstName === 'foo' &&
                                values.category === 'bar'
                            );
                        },
                    }
                )
            ).toEqual({
                show: true,
                dependsOnValue: {
                    category: 'bar',
                    author: {
                        firstName: 'foo',
                    },
                },
            });
        });
    });
});

describe('<DependentInput />', () => {
    test('returns null when show prop is false', () => {
        const wrapper = shallow(
            <DependentInput show={false}>
                <span />
            </DependentInput>
        );
        expect(wrapper.type() === null);
    });

    test('returns a unique FormField element when passed a unique child', () => {
        const wrapper = shallow(
            <DependentInput show={true}>
                <span source="aSource" />
            </DependentInput>
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
            <DependentInput show={true}>
                <span className="1" />
                <span className="2" />
                <span className="3" />
            </DependentInput>
        );

        expect(wrapper.at(0).type()).toEqual('div');
        const formFields = wrapper.find('Connect(FormField)');
        expect(formFields.length).toEqual(3);

        expect(formFields.at(0).prop('input')).toEqual(<span className="1" />);
        expect(formFields.at(1).prop('input')).toEqual(<span className="2" />);
        expect(formFields.at(2).prop('input')).toEqual(<span className="3" />);
    });
});
