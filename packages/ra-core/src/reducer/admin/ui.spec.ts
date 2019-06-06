import assert from 'assert';
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
        assert.deepEqual(defaultState, reducer(undefined, { type: 'foo' }));
    });
    it('should toggle sidebar visibility upon TOGGLE_SIDEBAR', () => {
        assert.deepEqual(
            { ...defaultState, sidebarOpen: false },
            reducer({ ...defaultState, sidebarOpen: true }, toggleSidebar())
        );
        assert.deepEqual(
            { ...defaultState, sidebarOpen: true },
            reducer({ ...defaultState, sidebarOpen: false }, toggleSidebar())
        );
    });
    it('should set sidebar visibility upon SET_SIDEBAR_VISIBILITY', () => {
        assert.deepEqual(
            { ...defaultState, sidebarOpen: false },
            reducer(
                { ...defaultState, sidebarOpen: true },
                setSidebarVisibility(false)
            )
        );
        assert.deepEqual(
            { ...defaultState, sidebarOpen: true },
            reducer(
                { ...defaultState, sidebarOpen: true },
                setSidebarVisibility(true)
            )
        );
        assert.deepEqual(
            { ...defaultState, sidebarOpen: false },
            reducer(
                { ...defaultState, sidebarOpen: false },
                setSidebarVisibility(false)
            )
        );
        assert.deepEqual(
            { ...defaultState, sidebarOpen: true },
            reducer(
                { ...defaultState, sidebarOpen: false },
                setSidebarVisibility(true)
            )
        );
    });
    it('should increment the viewVersion upon REFRESH_VIEW', () => {
        assert.deepEqual(
            { optimistic: false, sidebarOpen: false, viewVersion: 1 },
            reducer(undefined, refreshView())
        );
    });
});
