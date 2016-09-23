import assert from 'assert';
import { render } from 'enzyme';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import FilterForm from './FilterForm';
import TextInput from '../input/TextInput';

describe.only('<FilterForm />', () => {
    let resource;
    let filters;
    let setFilter;
    let hideFilter;
    let displayedFilters;
    let filterValues;

    beforeEach(() => {
        resource = 'post';
        filters = [];
        setFilter = () => {};
        hideFilter = () => {};
        displayedFilters = {};
        filterValues = {};
    });

    it('should display correctly passed filters', () => {
        filters = [<TextInput source="title" />];
        displayedFilters = { title: true };

        const muiTheme = getMuiTheme({ userAgent: false });
        const wrapper = render(
            <MuiThemeProvider muiTheme={muiTheme}>
                <FilterForm
                    resource={resource}
                    filters={filters}
                    setFilter={setFilter}
                    hideFilter={hideFilter}
                    displayedFilters={displayedFilters}
                    filterValues={filterValues}
                />
            </MuiThemeProvider>
        );

        const titleFilter = wrapper.find('input[type="text"]');
        assert.equal(titleFilter.length, 1);
    });
});
