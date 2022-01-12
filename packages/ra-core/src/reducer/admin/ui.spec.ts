import expect from 'expect';
import { toggleSidebar, setSidebarVisibility } from '../../actions/uiActions';
import reducer from './ui';

describe('ui reducer', () => {
    const defaultState = {
        sidebarOpen: false,
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
});
