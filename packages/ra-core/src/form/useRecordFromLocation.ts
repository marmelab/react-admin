import { useEffect, useRef, useState } from 'react';
import { parse } from 'query-string';
import { Location, useLocation } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { RaRecord } from '../types';

/**
 * A hook that returns the record to use to override the values in a form
 * @param options The hook options
 * @param options.searchSource The key in the location search to use as a source for the record. Its content should be a stringified JSON object.
 * @param options.stateSource The key in the location state to use as a source for the record
 * @returns The record to use to override the values in a form
 */
export const useRecordFromLocation = (
    props: UseRecordFromLocationOptions = {}
) => {
    const { searchSource, stateSource } = props;
    const location = useLocation();
    const [recordFromLocation, setRecordFromLocation] = useState(() =>
        getRecordFromLocation(location, {
            stateSource,
            searchSource,
        })
    );

    // To avoid having the form resets when the location changes but the final record is the same
    // This is needed for forms such as TabbedForm or WizardForm that may change the location for their sections
    const previousRecordRef = useRef(recordFromLocation);

    useEffect(() => {
        const newRecordFromLocation = getRecordFromLocation(location, {
            stateSource,
            searchSource,
        });

        if (!isEqual(newRecordFromLocation, previousRecordRef.current)) {
            previousRecordRef.current = newRecordFromLocation;
            setRecordFromLocation(newRecordFromLocation);
        }
    }, [location, stateSource, searchSource]);

    return recordFromLocation;
};

export type UseRecordFromLocationOptions = {
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
): Partial<RaRecord> | null => {
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
                    return null;
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
