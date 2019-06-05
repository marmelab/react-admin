import { Record, Translate } from '../../types';
import { MatchingReferencesError } from './types';

interface GetStatusForInputParams {
    input: {
        value: any;
    };
    matchingReferences: Record[] | MatchingReferencesError;
    referenceRecord: Record;
    translate: Translate;
}

const isMatchingReferencesError = (matchingReferences?: any): matchingReferences is MatchingReferencesError =>
    matchingReferences && matchingReferences.error !== undefined;

export const getStatusForInput = ({
    input,
    matchingReferences,
    referenceRecord,
    translate = x => x,
}: GetStatusForInputParams) => {
    const matchingReferencesError = isMatchingReferencesError(matchingReferences)
        ? translate(matchingReferences.error, {
              _: matchingReferences.error,
          })
        : null;
    const selectedReferenceError =
        input.value && !referenceRecord
            ? translate('ra.input.references.single_missing', {
                  _: 'ra.input.references.single_missing',
              })
            : null;

    return {
        waiting:
            (input.value && selectedReferenceError && !matchingReferences) || (!input.value && !matchingReferences),
        error:
            (input.value && selectedReferenceError && matchingReferencesError) ||
            (!input.value && matchingReferencesError)
                ? input.value
                    ? selectedReferenceError
                    : matchingReferencesError
                : null,
        warning: selectedReferenceError || matchingReferencesError,
        choices: Array.isArray(matchingReferences) ? matchingReferences : [referenceRecord].filter(choice => choice),
    };
};

export const REFERENCES_STATUS_READY = 'REFERENCES_STATUS_READY';
export const REFERENCES_STATUS_INCOMPLETE = 'REFERENCES_STATUS_INCOMPLETE';
export const REFERENCES_STATUS_EMPTY = 'REFERENCES_STATUS_EMPTY';

export const getSelectedReferencesStatus = (
    input: {
        value: any;
    },
    referenceRecords: Record[]
) =>
    !input.value || input.value.length === referenceRecords.length
        ? REFERENCES_STATUS_READY
        : referenceRecords.length > 0
        ? REFERENCES_STATUS_INCOMPLETE
        : REFERENCES_STATUS_EMPTY;

interface GetStatusForArrayInputParams {
    input: {
        value: any;
    };
    matchingReferences: Record[] | MatchingReferencesError;
    referenceRecords: Record[];
    translate: Translate;
}

export const getStatusForArrayInput = ({
    input,
    matchingReferences,
    referenceRecords,
    translate = x => x,
}: GetStatusForArrayInputParams) => {
    // selectedReferencesData can be "empty" (no data was found for references from input.value)
    // or "incomplete" (Not all of the reference data was found)
    // or "ready" (all references data was found or there is no references from input.value)
    const selectedReferencesData = getSelectedReferencesStatus(input, referenceRecords);

    const matchingReferencesError = isMatchingReferencesError(matchingReferences)
        ? translate(matchingReferences.error, {
              _: matchingReferences.error,
          })
        : null;

    return {
        waiting:
            (!matchingReferences && input.value && selectedReferencesData === REFERENCES_STATUS_EMPTY) ||
            (!matchingReferences && !input.value),
        error:
            matchingReferencesError &&
            (!input.value || (input.value && selectedReferencesData === REFERENCES_STATUS_EMPTY))
                ? translate('ra.input.references.all_missing', {
                      _: 'ra.input.references.all_missing',
                  })
                : null,
        warning:
            matchingReferencesError || (input.value && selectedReferencesData !== REFERENCES_STATUS_READY)
                ? matchingReferencesError ||
                  translate('ra.input.references.many_missing', {
                      _: 'ra.input.references.many_missing',
                  })
                : null,
        choices: Array.isArray(matchingReferences) ? matchingReferences : referenceRecords,
    };
};
