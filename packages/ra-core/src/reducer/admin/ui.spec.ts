import expect from 'expect';
import {
    toggleSidebar,
    setSidebarVisibility,
    refreshView,
} from '../../actions/uiActions';
import reducer from './ui';

describe('ui reducer', () => {
    const defaultState = {
        sidebarOpen: false,
        optimistic: false,
        viewVersion: 0,
    };
    it('should return hidden sidebar by default', () => {
        expect(reducer(undefined, { type: 'foo' })).toEqual(defaultState);
    });
    it('should toggle sidebar visibility upon TOGGLE_SIDEBAR', () => {
        expect({ ...defaultState, sidebarOpen: false }).toEqual(
            reducer({ ...defaultState, sidebarOpen: true }, toggleSidebar())
        );
        expect({ ...defaultState, sidebarOpen: true }).toEqual(
            reducer({ ...defaultState, sidebarOpen: false }, toggleSidebar())
        );
    });
    it('should set sidebar visibility upon SET_SIDEBAR_VISIBILITY', () => {
        expect({ ...defaultState, sidebarOpen: false }).toEqual(
            reducer(
                { ...defaultState, sidebarOpen: true },
                setSidebarVisibility(false)
            )
        );
        expect({ ...defaultState, sidebarOpen: true }).toEqual(
            reducer(
                { ...defaultState, sidebarOpen: true },
                setSidebarVisibility(true)
            )
        );
        expect({ ...defaultState, sidebarOpen: false }).toEqual(
            reducer(
                { ...defaultState, sidebarOpen: false },
                setSidebarVisibility(false)
            )
        );
        expect({ ...defaultState, sidebarOpen: true }).toEqual(
            reducer(
                { ...defaultState, sidebarOpen: false },
                setSidebarVisibility(true)
            )
        );
    });
    it('should increment the viewVersion upon REFRESH_VIEW', () => {
        expect({
            optimistic: false,
            sidebarOpen: false,
            viewVersion: 1,
        }).toEqual(reducer(undefined, refreshView()));
    });
});
