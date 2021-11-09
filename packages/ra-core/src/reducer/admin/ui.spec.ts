import expect from 'expect';
import {
    toggleSidebar,
    setSidebarVisibility,
    refreshView,
    setAutomaticRefresh,
} from '../../actions/uiActions';
import reducer from './ui';

describe('ui reducer', () => {
    const defaultState = {
        automaticRefreshEnabled: true,
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
    it('should return activated automatic refresh by default', () => {
        expect(reducer(undefined, { type: 'foo' })).toEqual(defaultState);
    });
    it('should set sidebar visibility upon SET_AUTOMATIC_REFRESH', () => {
        expect({ ...defaultState, automaticRefreshEnabled: false }).toEqual(
            reducer(
                { ...defaultState, automaticRefreshEnabled: true },
                setAutomaticRefresh(false)
            )
        );
        expect({ ...defaultState, automaticRefreshEnabled: true }).toEqual(
            reducer(
                { ...defaultState, automaticRefreshEnabled: true },
                setAutomaticRefresh(true)
            )
        );
        expect({ ...defaultState, automaticRefreshEnabled: false }).toEqual(
            reducer(
                { ...defaultState, automaticRefreshEnabled: false },
                setAutomaticRefresh(false)
            )
        );
        expect({ ...defaultState, automaticRefreshEnabled: true }).toEqual(
            reducer(
                { ...defaultState, automaticRefreshEnabled: false },
                setAutomaticRefresh(true)
            )
        );
    });
    it('should increment the viewVersion upon REFRESH_VIEW', () => {
        expect({
            automaticRefreshEnabled: true,
            optimistic: false,
            sidebarOpen: false,
            viewVersion: 1,
        }).toEqual(reducer(undefined, refreshView()));
    });
});
