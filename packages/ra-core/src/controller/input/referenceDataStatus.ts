import { RaRecord, Translate } from '../../types';
import { MatchingReferencesError } from './types';
import { ControllerRenderProps } from 'react-hook-form';

interface GetStatusForInputParams<RecordType extends RaRecord = RaRecord> {
    field: Pick<ControllerRenderProps, 'value'>;
    matchingReferences: RecordType[] | MatchingReferencesError;
    referenceRecord: RecordType;
    translate: Translate;
}

const isMatchingReferencesError = (
    matchingReferences?: any
): matchingReferences is MatchingReferencesError =>
    matchingReferences && matchingReferences.error !== undefined;

export const getStatusForInput = <RecordType extends RaRecord = RaRecord>({
    field,
    matchingReferences,
    referenceRecord,
    translate = x => x,
}: GetStatusForInputParams<RecordType>) => {
    const matchingReferencesError = isMatchingReferencesError(
        matchingReferences
    )
        ? translate(matchingReferences.error, {
              _: matchingReferences.error,
          })
        : null;
    const selectedReferenceError =
        field.value && !referenceRecord
            ? translate('ra.input.references.single_missing', {
                  _: 'ra.input.references.single_missing',
              })
            : null;

    return {
        waiting:
            (field.value && selectedReferenceError && !matchingReferences) ||
            (!field.value && !matchingReferences),
        error:
            (field.value &&
                selectedReferenceError &&
                matchingReferencesError) ||
            (!field.value && matchingReferencesError)
                ? field.value
                    ? selectedReferenceError
                    : matchingReferencesError
                : null,
        warning: selectedReferenceError || matchingReferencesError,
        choices: Array.isArray(matchingReferences)
            ? matchingReferences
            : [referenceRecord].filter(choice => choice),
    };
};

export const REFERENCES_STATUS_READY = 'REFERENCES_STATUS_READY';
export const REFERENCES_STATUS_INCOMPLETE = 'REFERENCES_STATUS_INCOMPLETE';
export const REFERENCES_STATUS_EMPTY = 'REFERENCES_STATUS_EMPTY';

export const getSelectedReferencesStatus = <RecordType extends RaRecord = any>(
    field: Pick<ControllerRenderProps, 'value'>,
    referenceRecords: RecordType[]
) =>
    !field.value || field.value.length === referenceRecords.length
        ? REFERENCES_STATUS_READY
        : referenceRecords.length > 0
          ? REFERENCES_STATUS_INCOMPLETE
          : REFERENCES_STATUS_EMPTY;

interface GetStatusForArrayInputParams<RecordType extends RaRecord = any> {
    field: ControllerRenderProps;
    matchingReferences: RecordType[] | MatchingReferencesError;
    referenceRecords: RecordType[];
    translate: Translate;
}

export const getStatusForArrayInput = <RecordType extends RaRecord = any>({
    field,
    matchingReferences,
    referenceRecords,
    translate = x => x,
}: GetStatusForArrayInputParams<RecordType>) => {
    // selectedReferencesDataStatus can be "empty" (no data was found for references from input.value)
    // or "incomplete" (Not all of the reference data was found)
    // or "ready" (all references data was found or there is no references from input.value)
    const selectedReferencesDataStatus = getSelectedReferencesStatus(
        field,
        referenceRecords
    );

    const matchingReferencesError = isMatchingReferencesError(
        matchingReferences
    )
        ? translate(matchingReferences.error, {
              _: matchingReferences.error,
          })
        : null;

    const choices = Array.isArray(matchingReferences)
        ? referenceRecords.concat(
              matchingReferences.filter(
                  choice =>
                      referenceRecords.findIndex(c => c.id === choice.id) === -1
              )
          )
        : referenceRecords;

    return {
        waiting:
            (!matchingReferences &&
                field.value &&
                selectedReferencesDataStatus === REFERENCES_STATUS_EMPTY) ||
            (!matchingReferences && !field.value),
        error:
            matchingReferencesError &&
            (!field.value ||
                (field.value &&
                    selectedReferencesDataStatus === REFERENCES_STATUS_EMPTY))
                ? translate('ra.input.references.all_missing', {
                      _: 'ra.input.references.all_missing',
                  })
                : null,
        warning:
            matchingReferencesError ||
            (field.value &&
                selectedReferencesDataStatus !== REFERENCES_STATUS_READY)
                ? matchingReferencesError ||
                  translate('ra.input.references.many_missing', {
                      _: 'ra.input.references.many_missing',
                  })
                : null,
        choices,
    };
};
