import React from 'react';
import { shallow } from 'enzyme';
import { Tab, TextField } from 'react-admin';

import UserShow from './UserShow';

// Mock React Admin so we don't have to resolve it
// Do not take this into account for the example
// The tests are valid if react-admin package is installed
jest.mock('react-admin', () => ({
    Show: ({ children }) => <div />,
    Tab: ({ children }) => <div />,
    TabbedShowLayout: ({ children }) => <div />,
    TextField: ({ children }) => <div />,
    translate: x => x,
}));

// Supress PropTypes warning by default
const defaultProps = {
    location: {},
    match: {},
};

describe('UserShow', () => {
    describe('As User', () => {
        it('should display one tab', () => {
            const wrapper = shallow(<UserShow {...defaultProps} permissions="user" />);

            const tab = wrapper.find(Tab);
            expect(tab.length).toBe(1);
        });

        it('should show the user identity in the first tab', () => {
            const wrapper = shallow(<UserShow {...defaultProps} permissions="user" />);

            const tab = wrapper.find(Tab);
            const fields = tab.find(TextField);

            expect(fields.at(0).prop('source')).toBe('id');
            expect(fields.at(1).prop('source')).toBe('name');
        });
    });

    describe('As Admin', () => {
        it('should display two tabs', () => {
            const wrapper = shallow(<UserShow {...defaultProps} permissions="admin" />);

            const tabs = wrapper.find(Tab);
            expect(tabs.length).toBe(2);
        });

        it('should show the user identity in the first tab', () => {
            const wrapper = shallow(<UserShow {...defaultProps} permissions="admin" />);

            const tabs = wrapper.find(Tab);
            const fields = tabs.at(0).find(TextField);

            expect(fields.at(0).prop('source')).toBe('id');
            expect(fields.at(1).prop('source')).toBe('name');
        });

        it('should show the user role in the second tab', () => {
            const wrapper = shallow(<UserShow {...defaultProps} permissions="admin" />);

            const tabs = wrapper.find(Tab);
            const fields = tabs.at(1).find(TextField);

            expect(fields.at(0).prop('source')).toBe('role');
        });
    });
});
