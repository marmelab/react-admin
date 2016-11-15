import assert from 'assert';
import { render } from 'enzyme';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FilterForm from './FilterForm';
import TextInput from '../input/TextInput';

try {
    require('react-tap-event-plugin')();
} catch(e) {
    // already loaded, probably in watch mode
    // do nothing
}

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
        store = createStore(() => {});
    });

    it('should display correctly passed filters', () => {
        const filters = [<TextInput source="title" label="Title" />];
        const displayedFilters = { title: true };

        const muiTheme = getMuiTheme({ userAgent: false });
        const wrapper = render(
            <Provider store={store}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <FilterForm
                        {...defaultProps}
                        filters={filters}
                        displayedFilters={displayedFilters}
                    />
                </MuiThemeProvider>
            </Provider>
        );

        const titleFilter = wrapper.find('input[type="text"]');
        assert.equal(titleFilter.length, 1);
    });
});
