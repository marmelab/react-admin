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
        const data: any = {
            field: {},
            matchingReferences: null,
            referenceRecord: null,
            translate: x => `*${x}*`,
        };

        it('should wait until the references fetch is finished and there is no reference already associated with the resource', () => {
            expect(getStatusForInput(data).waiting).toEqual(true);
        });
        it('should wait until the references fetch is finished and linked reference data are not found', () => {
            expect(
                getStatusForInput({ ...data, field: { value: 1 } }).waiting
            ).toEqual(true);
        });
        it('should be ready if the references fetch is not finished but linked reference data are found', () => {
            expect(
                getStatusForInput({
                    ...data,
                    field: { value: 1 },
                    referenceRecord: [{ id: 1 }],
                }).waiting
            ).toEqual(false);
        });
        it('should be ready if linked reference data are not found, but the references fetch is finished', () => {
            expect(
                getStatusForInput({
                    ...data,
                    field: { value: 1 },
                    matchingReferences: [],
                }).waiting
            ).toEqual(false);
        });
        it('should be ready if linked reference data are not found, but the references fetch is finished with error', () => {
            expect(
                getStatusForInput({
                    ...data,
                    field: { value: 1 },
                    matchingReferences: { error: 'error' },
                }).waiting
            ).toEqual(false);
        });
        it('should return an error if the references fetch fails and there is no linked reference', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error' },
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual('*error*');
        });
        it('should return an error if the references fetch fails and there is no linked reference', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error' },
                field: { value: 1 },
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual(
                '*ra.input.references.single_missing*'
            );
        });
        it('should not return an error if the references fetch fails but there is a linked reference with data', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error' },
                field: { value: 1 },
                referenceRecord: [{ id: 1 }],
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual(null);
        });
        it('should not return an error if there is a linked reference without data but the references fetch succeeds', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: [{ id: 2 }],
                field: { value: 1 },
                referenceRecord: null,
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual(null);
        });
        it('should not return an error if there is a linked reference without data but the references fetch succeeds even empty', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: [],
                field: { value: 1 },
                referenceRecord: null,
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual(null);
        });
        it('should not return an error if the references fetch succeeds and there is no linked reference', () => {
            const result = getStatusForInput({
                ...data,
                matchingReferences: [{ id: 1 }],
            });
            expect(result.waiting).toEqual(false);
            expect(result.error).toEqual(null);
        });

        it('should return a warning if the references fetch fails but there is a linked reference with data', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error on fetch' },
                field: { value: 1 },
                referenceRecord: [{ id: 1 }],
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual('*error on fetch*');
        });
        it('should return a warning if there is a linked reference without data but the references fetch succeeds', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: [{ id: 2 }],
                field: { value: 1 },
                referenceRecord: null,
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual(
                '*ra.input.references.single_missing*'
            );
        });
        it('should not return a warning if there is a linked reference with data and the references fetch succeeds even empty', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: [],
                field: { value: 1 },
                referenceRecord: [{ value: 1 }],
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual(null);
        });
        it('should not return a warning if the references fetch succeeds and there is no linked reference', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: [],
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual(null);
        });
        it('should return choices if the references fetch fails the single choice is the linked reference', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error on fetch' },
                field: { value: 1 },
                referenceRecord: { id: 1 },
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual('*error on fetch*');
            expect(status.choices).toEqual([{ id: 1 }]);
        });
        it('should return choices as returned by fetch if there is no data for the linked reference', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: { error: 'error on fetch' },
                field: { value: 1 },
                referenceRecord: { id: 1 },
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual('*error on fetch*');
            expect(status.choices).toEqual([{ id: 1 }]);
        });
        it('should return the choices returned by fetch (that will include the linked reference, but this is not managed at getStatusForInput method level.) if there is data for the linked reference and the references fetch succeeds', () => {
            const status = getStatusForInput({
                ...data,
                matchingReferences: [{ id: 1 }, { id: 2 }],
                field: { value: 1 },
                referenceRecord: { id: 1 },
            });

            expect(status.waiting).toEqual(false);
            expect(status.error).toEqual(null);
            expect(status.warning).toEqual(null);
            expect(status.choices).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });

    describe('getSelectedReferencesStatus', () => {
        it.each([
            [{}, []],
            [{ value: null }, []],
            [{ value: false }, []],
            [{ value: [] }, []],
        ])(
            'should return ready if input value has no references',
            (input, referenceRecords) => {
                const status = getSelectedReferencesStatus(
                    // @ts-expect-error
                    input,
                    referenceRecords
                );
                expect(status).toEqual(REFERENCES_STATUS_READY);
            }
        );

        it('should return empty if there is some input values but the referenceRecords is empty', () => {
            expect(getSelectedReferencesStatus({ value: [1, 2] }, [])).toEqual(
                REFERENCES_STATUS_EMPTY
            );
        });

        it('should return incomplete if there is less data in the referenceRecords than values in the input value', () => {
            expect(
                getSelectedReferencesStatus({ value: [1, 2] }, [{ id: 1 }])
            ).toEqual(REFERENCES_STATUS_INCOMPLETE);
        });

        it('should return ready if there is as much data in the referenceRecords as there are values in the input value', () => {
            expect(
                getSelectedReferencesStatus({ value: [1, 2] }, [
                    { id: 1 },
                    { id: 2 },
                ])
            ).toEqual(REFERENCES_STATUS_READY);
        });
    });

    describe('getStatusForArrayInput', () => {
        const data = {
            field: {},
            matchingReferences: null,
            referenceRecords: [],
            translate: x => `*${x}*`,
        };

        it('should indicate whether the data are ready or not', () => {
            const test = (params, waiting, explanation) =>
                assert.equal(
                    getStatusForArrayInput(params).waiting,
                    waiting,
                    explanation
                );
            test(
                data,
                true,
                'we must waitFor until the references fetch is finished and there is no reference already associated with the resource.'
            );
            test(
                { ...data, field: { value: [1, 2] } },
                true,
                'we must waitFor until the references fetch is finished and linked references data are not found.'
            );
            test(
                {
                    ...data,
                    field: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }],
                },
                false,
                'it is ready if the references fetch is not finished but at least one linked reference data are found.'
            );
            test(
                { ...data, field: { value: [1, 2] }, matchingReferences: [] },
                false,
                'it is ready if none linked reference data are not found, but the references fetch is finished.'
            );
            test(
                {
                    ...data,
                    field: { value: [1, 2] },
                    matchingReferences: { error: 'error' },
                },
                false,
                'it is ready if linked reference data are not found, but the references fetch is finished with error.'
            );
        });

        it('should return an error if needed', () => {
            const test = (params, error, explanation) => {
                const status = getStatusForArrayInput(params);
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
                    field: { value: [1] },
                },
                '*ra.input.references.all_missing*',
                'there is an error if the references fetch fails and there is all linked reference without data'
            );
            test(
                {
                    ...data,
                    matchingReferences: { error: 'error' },
                    field: { value: [1, 2] },
                    referenceRecords: [{ id: 1 }],
                },
                null,
                'there is no error if the references fetch fails but there is at least one linked reference with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 2 }],
                    field: { value: [1, 2] },
                    referenceRecords: [],
                },
                null,
                'there is no error if there is all linked references without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    field: { value: [1, 2] },
                    referenceRecords: [],
                },
                null,
                'there is no error if there is a linked reference without data but the references fetch succeeds even empty'
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
            const test = (params, warning, explanation) => {
                const status = getStatusForArrayInput(params);
                assert.equal(status.waiting, false);
                assert.equal(status.error, null);
                assert.equal(status.warning, warning, explanation);
            };

            test(
                {
                    ...data,
                    matchingReferences: { error: 'error on fetch' },
                    field: { value: [1] },
                    referenceRecords: [{ id: 1 }],
                },
                '*error on fetch*',
                'there is a warning if the references fetch fails but there is linked references with data'
            );
            test(
                {
                    ...data,
                    matchingReferences: [{ id: 3 }],
                    field: { value: [1, 2] },
                    referenceRecords: [{ id: 2 }],
                },
                '*ra.input.references.many_missing*',
                'there is a warning if there is at least one linked reference without data but the references fetch succeeds'
            );
            test(
                {
                    ...data,
                    matchingReferences: [],
                    field: { value: [1, 2] },
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

        // it('should return choices consistent with the data status', () => {
        //     const test = (params, warning, choices, explanation) => {
        //         const status = getStatusForArrayInput(params);
        //         assert.equal(status.waiting, false);
        //         assert.equal(status.error, null);
        //         assert.equal(status.warning, warning);
        //         assert.deepEqual(status.choices, choices, explanation);
        //     };

        //     test(
        //         {
        //             ...data,
        //             matchingReferences: { error: 'error on fetch' },
        //             field: { value: [1, 2] },
        //             referenceRecords: [{ id: 1 }, { id: 2 }],
        //         },
        //         '*error on fetch*',
        //         [{ id: 1 }, { id: 2 }],
        //         'if the references fetch fails the choices are the linked references'
        //     );
        //     test(
        //         {
        //             ...data,
        //             matchingReferences: [{ id: 3 }],
        //             field: { value: [1, 2] },
        //             referenceRecords: [],
        //         },
        //         '*ra.input.references.many_missing*',
        //         [{ id: 3 }],
        //         'if there is no data for the linked references, the choices are those returned by fetch'
        //     );
        //     test(
        //         {
        //             ...data,
        //             matchingReferences: [
        //                 { id: 1 },
        //                 { id: 2 },
        //                 { id: 3 },
        //                 { id: 4 },
        //             ],
        //             field: { value: [1, 2] },
        //             referenceRecords: [{ id: 1 }, { id: 2 }],
        //         },
        //         null,
        //         [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        //         'if there is data for the linked reference and the references fetch succeeds, we use the choices returned by fetch (that will include the linked reference, but this is not managed at getStatusForArrayInput method level.)'
        //     );
        // });
    });
});
