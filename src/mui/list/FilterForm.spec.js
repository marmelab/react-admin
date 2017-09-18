import assert from 'assert';
import { render } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TranslationProvider from '../../i18n/TranslationProvider';
import FilterForm, { mergeInitialValuesWithDefaultValues } from './FilterForm';
import TextInput from '../input/TextInput';

describe('<FilterForm />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [],
        setFilter: () => {},
        hideFilter: () => {},
        displayedFilters: {},
        filterValues: {},
        translate: x => x,
    };

    let store;
    beforeEach(() => {
        store = createStore(() => ({ locale: 'en' }));
    });

    it('should display correctly passed filters', () => {
        const filters = [<TextInput source="title" label="Title" />]; // eslint-disable-line react/jsx-key
        const displayedFilters = { title: true };

        const muiTheme = getMuiTheme({ userAgent: false });
        const wrapper = render(
            <Provider store={store}>
                <TranslationProvider>
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <FilterForm
                            {...defaultProps}
                            filters={filters}
                            displayedFilters={displayedFilters}
                        />
                    </MuiThemeProvider>
                </TranslationProvider>
            </Provider>
        );

        const titleFilter = wrapper.find('input[type="text"]');
        assert.equal(titleFilter.length, 1);
    });

    describe('mergeInitialValuesWithDefaultValues', () => {
        it('should correctly merge initial values with the default values of the alwayson filters', () => {
            const initialValues = {
                title: 'initial title',
            };
            const filters = [
                {
                    props: {
                        source: 'title',
                        alwaysOn: true,
                        defaultValue: 'default title',
                    },
                },
                {
                    props: {
                        source: 'url',
                        alwaysOn: true,
                        defaultValue: 'default url',
                    },
                },
                { props: { source: 'notMe', defaultValue: 'default url' } },
                { props: { source: 'notMeEither' } },
            ];

            assert.deepEqual(
                mergeInitialValuesWithDefaultValues({ initialValues, filters }),
                {
                    initialValues: {
                        title: 'initial title',
                        url: 'default url',
                    },
                }
            );
        });
    });
});
