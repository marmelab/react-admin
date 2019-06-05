import assert from 'assert';
import { render } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { TranslationProvider } from 'ra-core';
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
    };

    let store;
    beforeEach(() => {
        store = createStore(() => ({ i18n: { locale: 'en' } }));
    });

    it('should display correctly passed filters', () => {
        const filters = [<TextInput source="title" label="Title" />]; // eslint-disable-line react/jsx-key
        const displayedFilters = { title: true };

        const muiTheme = createMuiTheme({ userAgent: false });
        const wrapper = render(
            <Provider store={store}>
                <TranslationProvider>
                    <MuiThemeProvider theme={muiTheme}>
                        <FilterForm {...defaultProps} filters={filters} displayedFilters={displayedFilters} />
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
                {
                    props: {
                        source: 'author.name',
                        alwaysOn: true,
                        defaultValue: 'default author',
                    },
                },
                { props: { source: 'notMe', defaultValue: 'default url' } },
                { props: { source: 'notMeEither' } },
            ];

            assert.deepEqual(mergeInitialValuesWithDefaultValues({ initialValues, filters }), {
                initialValues: {
                    title: 'initial title',
                    url: 'default url',
                    author: { name: 'default author' },
                },
            });
        });
    });
});
