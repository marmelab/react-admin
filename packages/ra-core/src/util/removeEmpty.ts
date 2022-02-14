import { shallowEqual } from './shallowEqual';
import { FilterItem } from '../types';

const isEmpty = obj =>
    obj instanceof Date
        ? false
        : obj === '' ||
          obj === null ||
          obj === undefined ||
          shallowEqual(obj, {});

const removeEmpty = (filters: FilterItem[]) =>
    filters.filter(filterItem => !isEmpty(filterItem.value));

export default removeEmpty;
