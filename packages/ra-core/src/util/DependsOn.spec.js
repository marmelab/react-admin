import React from 'react';
import { shallow } from 'enzyme';
import { DependsOnView, mapStateToProps } from './DependsOn';

describe('DependsOn', () => {
    describe('mapStateToProps', () => {
        describe('within form', () => {
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
                                source: 'firstName',
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
                            { source: 'firstName' }
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
                            { source: 'author.firstName' }
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
                            { source: 'author.firstName' }
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
                            { source: 'firstName', value: 'foo' }
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
                            { source: 'firstName', value: 'foo' }
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
                                source: 'firstName',
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
                                source: 'firstName',
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
                            { source: ['firstName', 'lastName'] }
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
                            { source: ['firstName', 'lastName'] }
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
                            { source: ['author.firstName', 'date'] }
                        )
                    ).toEqual({
                        show: false,
                        dependsOnValue: {
                            date,
                            author: { firstName: undefined },
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
                                            date,
                                            author: {
                                                firstName: 'blublu',
                                            },
                                        },
                                    },
                                },
                            },
                            { source: ['author.firstName', 'date'] }
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
                                source: ['author.firstName', 'category'],
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
                                source: ['author.firstName', 'category'],
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
                                source: ['author.firstName', 'category'],
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
                                source: ['author.firstName', 'category'],
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

        describe('within view', () => {
            describe('with resolve function', () => {
                test('returns { show: false } if the resolve returns false', () => {
                    const resolve = jest.fn(() => false);
                    expect(mapStateToProps({}, { resolve })).toEqual({
                        show: false,
                    });
                });

                test('returns { show: true } if the resolve returns true', () => {
                    const resolve = jest.fn(() => true);
                    expect(mapStateToProps({}, { resolve })).toEqual({
                        show: true,
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
                                source: 'firstName',
                            }
                        )
                    ).toEqual({ show: false, dependsOnValue: undefined });
                });

                test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: 'firstName',
                                record: {
                                    firstName: 'blublu',
                                },
                            }
                        )
                    ).toEqual({ show: true, dependsOnValue: 'blublu' });
                });
            });

            describe('with only dependsOn specified as a deep path string', () => {
                test('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: 'author.firstName',
                                record: {
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            }
                        )
                    ).toEqual({
                        show: false,
                        dependsOnValue: undefined,
                    });
                });

                test('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: 'author.firstName',
                                record: {
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            }
                        )
                    ).toEqual({ show: true, dependsOnValue: 'blublu' });
                });
            });

            describe('with dependsOn specified as a string and a specific value', () => {
                test('returns { show: false } if the form does not have the specific value for the field matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: 'firstName',
                                value: 'foo',
                                record: {
                                    firstName: 'bar',
                                },
                            }
                        )
                    ).toEqual({ show: false, dependsOnValue: 'bar' });
                });

                test('returns { show: true } if the form have the specific value for the field matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: 'firstName',
                                value: 'foo',
                                record: {
                                    firstName: 'foo',
                                },
                            }
                        )
                    ).toEqual({ show: true, dependsOnValue: 'foo' });
                });
            });

            describe('with only dependsOn specified as an array', () => {
                test('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['firstName', 'lastName'],
                                record: {
                                    lastName: 'blublu',
                                },
                            }
                        )
                    ).toEqual({
                        show: false,
                        dependsOnValue: {
                            firstName: undefined,
                            lastName: 'blublu',
                        },
                    });
                });

                test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['firstName', 'lastName'],
                                record: {
                                    firstName: 'blublu',
                                    lastName: 'blublu',
                                },
                            }
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
                            {},
                            {
                                source: ['author.firstName', 'date'],
                                record: {
                                    date: date,
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            }
                        )
                    ).toEqual({
                        show: false,
                        dependsOnValue: {
                            author: { firstName: undefined },
                            date: date,
                        },
                    });
                });

                test('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['author.firstName', 'date'],
                                record: {
                                    date: date,
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            }
                        )
                    ).toEqual({
                        show: true,
                        dependsOnValue: {
                            author: { firstName: 'blublu' },
                            date: date,
                        },
                    });
                });
            });

            describe('with dependsOn specified as an array and specific values as an array', () => {
                test('returns { show: false } if the form does not have the specific values for the fields matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['author.firstName', 'category'],
                                record: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'bar',
                                    },
                                },
                                value: ['foo', 'bar'],
                            }
                        )
                    ).toEqual({
                        show: false,
                        dependsOnValue: {
                            author: { firstName: 'bar' },
                            category: 'bar',
                        },
                    });
                });

                test('returns { show: true } if the form have the specific values for the fields matching dependsOn', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['author.firstName', 'category'],
                                record: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'foo',
                                    },
                                },
                                value: ['foo', 'bar'],
                            }
                        )
                    ).toEqual({
                        show: true,
                        dependsOnValue: {
                            author: { firstName: 'foo' },
                            category: 'bar',
                        },
                    });
                });
            });

            describe('with dependsOn specified as an array and resolve', () => {
                test('returns { show: false } if the resolve function returns false', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['author.firstName', 'category'],
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
                    ).toEqual({
                        show: false,
                        dependsOnValue: {
                            author: { firstName: 'bar' },
                            category: 'bar',
                        },
                    });
                });

                test('returns { show: true } if the resolve function returns true', () => {
                    expect(
                        mapStateToProps(
                            {},
                            {
                                source: ['author.firstName', 'category'],
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
                    ).toEqual({
                        show: true,
                        dependsOnValue: {
                            author: { firstName: 'foo' },
                            category: 'bar',
                        },
                    });
                });
            });
        });
    });

    describe('<DependsOnView />', () => {
        test('returns null when show prop is false', () => {
            const wrapper = shallow(
                <DependsOnView show={false}>
                    <span />
                </DependsOnView>
            );
            expect(wrapper.type() === null);
        });

        test('returns a unique FormField element when passed a unique child', () => {
            const wrapper = shallow(
                <DependsOnView show={true}>
                    <span source="aSource" />
                </DependsOnView>
            );

            expect(wrapper.name()).toEqual('div');
            expect(wrapper.prop('className')).toEqual('ra-input-aSource');
            const formFields = wrapper.find('Connect(FormField)');
            expect(formFields.length).toEqual(1);
            expect(formFields.at(0).prop('input')).toEqual(
                <span source="aSource" />
            );
        });

        test('returns a span with FormField children for each passed child', () => {
            const wrapper = shallow(
                <DependsOnView show={true}>
                    <span className="1" />
                    <span className="2" />
                    <span className="3" />
                </DependsOnView>
            );

            expect(wrapper.at(0).type()).toEqual('div');
            const formFields = wrapper.find('Connect(FormField)');
            expect(formFields.length).toEqual(3);

            expect(formFields.at(0).prop('input')).toEqual(
                <span className="1" />
            );
            expect(formFields.at(1).prop('input')).toEqual(
                <span className="2" />
            );
            expect(formFields.at(2).prop('input')).toEqual(
                <span className="3" />
            );
        });
    });
});
