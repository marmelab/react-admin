import { combineReducers } from 'redux';
import props from './props';
import data, { get, getByIds } from './data';
import list from './list';

export default (resource = {}) =>
    combineReducers({
        props: props(resource),
        data: data(resource.name),
        list: list(resource.name),
    });

export const getData = state => state.data;

export const getRecord = (state, props) => get(getData(state), props);
export const getRecordsByIds = (state, props) =>
    getByIds(getData(state), props);

export const getList = state => state.list;
