import assert from 'assert';
import {
    getStatusForInput,
    getSelectedReferencesStatus,
    getStatusForArrayInput,
    REFERENCES_STATUS_READY,
    REFERENCES_STATUS_INCOMPLETE,
    REFERENCES_STATUS_EMPTY,
} from './referenceDataStatus';

describe('References data status', () => {
    describe('getStatusForInput', () => {
        const data = {
            input: {},
            matchingReferences: null,
            referenceRecord: null,
            translate: x => `*${x}*`,
        };

        it('should indicate whether the data are ready or not', () => {
            const test = (data, waiting, explanation) =>
                assert.equal(
                    getStatusForInput(data).waiting,
                    waiting,
                    explanation
                );
            test(
                data,
                true,
                'we must wait until the references fetch is finished and there is no reference already associated with the resource.'
            );
            test(
                { ...data, input: { value: 1 } },
                true,
                'we must wait until the references fetch is finished and linked reference data are not found.'
            );
            test(
                { ...data, input: { value: 1 }, referenceRecord: [{ id: 1 }] },
                false,
                'it is ready if the references fetch is not finished but linked reference data are found.'
            );
            test(
                { ...data, input: { value: 1 }, matchingReferences: [] },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished.'
            );
            test(
                {
                    ...data,
                    input: { value: 1 },
                    matchingReferences: { error: 'error' },
                },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished with error.'
            );
        });

        it('should claim an error if needed', () => {
            const test = (data, error, explanation) => {
                const status = getStatusForInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, error, explanation);
            };
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                },
                '*error*',
                'there is an error if the references fetch fails and there is no linked reference'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: 1 },
                },
                '*ra.input.references.single_missing*',
                'there is an error if the references fetch fails and there is a linked reference without data'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: 1 },
                    referenceRecord: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch fails but there is a linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds  even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch succeeds and there is no linked reference'
            );
        });

        it('should claim a warning if needed', () => {
            const test = (data, warning, explanation) => {
                const status = getStatusForInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: 1 },
                    referenceRecord: [{ id: 1 }],
                },
                '*error on fetch*',
                'there is a warning if the references fetch fails but there is a linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                '*ra.input.references.single_missing*',
                'there is a warning if there is a linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: 1 },
                    referenceRecord: [{ value: 1 }],
                },
                null,
                'there is no warning if there is a linked reference with data and the references fetch succeeds even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                },
                null,
                'there is no warning if the references fetch succeeds and there is no linked reference'
            );
        });

        it('should return choices consistent with the data status', () => {
            const test = (data, warning, choices, explanation) => {
                const status = getStatusForInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning);
                assert.deepEqual(status.choices, choices, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: 1 },
                    referenceRecord: { id: 1 },
                },
                '*error on fetch*',
                [{ id: 1 }],
                'if the references fetch fails the single choice is the linked reference'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: 1 },
                    referenceRecord: null,
                },
                '*ra.input.references.single_missing*',
                [{ id: 2 }],
                'if there is no data for the linked reference, the choices are those returned by fetch'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 1 }, { id: 2 }],
                    input: { value: 1 },
                    referenceRecord: { id: 1 },
                },
                null,
                [{ id: 1 }, { id: 2 }],
                'if there is data for the linked reference and the references fetch succeeds, we use the choices returned by fetch (that will include the linked reference, but this is not managed at getStatusForInput method level.)'
            );
        });
    });

    describe('getSelectedReferencesStatus', () => {
        it('should return ready if input value has no references', () => {
            const test = (input, referenceRecords) =>
                assert.equal(
                    getSelectedReferencesStatus(input, referenceRecords),
                    REFERENCES_STATUS_READY
                );

            test({}, []);
            test({ value: null }, []);
            test({ value: false }, []);
            test({ value: [] }, []);
        });

        it('should return empty if there is some input values but the referenceRecords is empty', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, []),
                REFERENCES_STATUS_EMPTY
            );
        });

        it('should return incomplete if there is less data in the referenceRecords than values in the input value', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, [{ id: 1 }]),
                REFERENCES_STATUS_INCOMPLETE
            );
        });

        it('should return ready if there is as much data in the referenceRecords as there are values in the input value', () => {
            assert.equal(
                getSelectedReferencesStatus({ value: [1, 2] }, [
                    { id: 1 },
                    { id: 2 },
                ]),
                REFERENCES_STATUS_READY
            );
        });
    });

    describe('getStatusForArrayInput', () => {
        const data = {
            input: {},
            matchingReferences: null,
            referenceRecords: [],
            translate: x => `*${x}*`,
        };

        it('should indicate whether the data are ready or not', () => {
            const test = (data, waiting, explanation) =>
                assert.equal(
                    getStatusForArrayInput(data).waiting,
                    waiting,
                    explanation
                );
            test(
                data,
                true,
                'we must wait until the references fetch is finished and there is no reference already associated with the resource.'
            );
            test(
                { ...data, input: { value: [1, 2] } },
                true,
                'we must wait until the references fetch is finished and linked references data are not found.'
            );
            test(
                {
                    ...data,
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }],
                },
                false,
                'it is ready if the references fetch is not finished but at least one linked reference data are found.'
            );
            test(
                { ...data, input: { value: [1, 2] }, matchingReferences: [] },
                false,
                'it is ready if none linked reference data are not found, but the references fetch is finished.'
            );
            test(
                {
                    ...data,
                    input: { value: [1, 2] },
                    matchingReferences: { error: 'error' },
                },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished with error.'
            );
        });

        it('should return an error if needed', () => {
            const test = (data, error, explanation) => {
                const status = getStatusForArrayInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, error, explanation);
            };
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                },
                '*ra.input.references.all_missing*',
                'there is an error if the references fetch fails and there is no linked reference'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: [1] },
                },
                '*ra.input.references.all_missing*',
                'there is an error if the references fetch fails and there is all linked reference without data'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch fails but there is at least one linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    input: { value: [1, 2] },
                    referenceRecords: [],
                },
                null,
                'there is no error if there is all linked references without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: [1, 2] },
                    referenceRecords: [],
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds  even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch succeeds and there is no linked reference'
            );
        });

        it('should return a warning if needed', () => {
            const test = (data, warning, explanation) => {
                const status = getStatusForArrayInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: [1] },
                    referenceRecords: [{ id: 1 }],
                },
                '*error on fetch*',
                'there is a warning if the references fetch fails but there is linked references with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 3 }],
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 2 }],
                },
                '*ra.input.references.many_missing*',
                'there is a warning if there is at least one linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }, { id: 2 }],
                },
                null,
                'there is no warning if there is all linked references with data and the references fetch succeeds even empty'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                },
                null,
                'there is no warning if the references fetch succeeds and there is no linked references'
            );
        });

        it('should return choices consistent with the data status', () => {
            const test = (data, warning, choices, explanation) => {
                const status = getStatusForArrayInput(data);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning);
                assert.deepEqual(status.choices, choices, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }, { id: 2 }],
                },
                '*error on fetch*',
                [{ id: 1 }, { id: 2 }],
                'if the references fetch fails the choices are the linked references'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 3 }],
                    input: { value: [1, 2] },
                    referenceRecords: [],
                },
                '*ra.input.references.many_missing*',
                [{ id: 3 }],
                'if there is no data for the linked references, the choices are those returned by fetch'
            );
            test(
                {
                    ...data,
                    matchingReferences: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                    ],
                    input: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }, { id: 2 }],
                },
                null,
                [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                'if there is data for the linked reference and the references fetch succeeds, we use the choices returned by fetch (that will include the linked reference, but this is not managed at getStatusForArrayInput method level.)'
            );
        });
    });
});
