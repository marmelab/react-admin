import { parse } from 'query-string';
import { Location, useLocation } from 'react-router-dom';
import merge from 'lodash/merge';
import { RaRecord } from '../types';
import { useRecordContext } from '../controller';

/**
 * A hook that returns the record to use as a form initial values. If a record is passed and the location search or state also contains a record, they will be merged.
 * @param options The hook options
 * @param options.record The record to use as initial values
 * @param options.searchSource The key in the location search to use as a source for the record. Its content should be a stringified JSON object.
 * @param options.stateSource The key in the location state to use as a source for the record
 * @returns The record to use as initial values in a form
 */
export const useRecordFromLocation = (
    props: UseRecordFromLocationOptions = {}
) => {
    const { searchSource, stateSource } = props;
    const location = useLocation();
    const record = useRecordContext(props);
    const recordFromLocation = getRecordFromLocation(location, {
        stateSource,
        searchSource,
    });

    return merge({}, record, recordFromLocation);
};

export type UseRecordFromLocationOptions = {
    record?: Partial<RaRecord>;
    searchSource?: string;
    stateSource?: string;
};

/**
 * Get the initial record from the location, whether it comes from the location
 * state or is serialized in the url search part.
 */
export const getRecordFromLocation = (
    { state, search }: Location,
    {
        searchSource = 'source',
        stateSource = 'record',
    }: {
        searchSource?: string;
        stateSource?: string;
    } = {}
) => {
    if (state && state[stateSource]) {
        return state[stateSource];
    }
    if (search) {
        try {
            const searchParams = parse(search);
            const source = searchParams[searchSource];
            if (source) {
                if (Array.isArray(source)) {
                    console.error(
                        `Failed to parse location ${searchSource} parameter '${search}'. To pre-fill some fields in the Create form, pass a stringified ${searchSource} parameter (e.g. '?${searchSource}={"title":"foo"}')`
                    );
                    return;
                }
                return JSON.parse(source);
            }
        } catch (e) {
            console.error(
                `Failed to parse location ${searchSource} parameter '${search}'. To pre-fill some fields in the Create form, pass a stringified ${searchSource} parameter (e.g. '?${searchSource}={"title":"foo"}')`
            );
        }
    }
    return null;
};
