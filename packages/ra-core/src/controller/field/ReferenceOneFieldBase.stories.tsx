import * as React from 'react';

import {
    CoreAdminContext,
    RecordContextProvider,
    ReferenceOneFieldBase,
    ResourceContextProvider,
    TestMemoryRouter,
    useReferenceFieldContext,
} from '../..';

export default { title: 'ra-core/controller/field/ReferenceOneFieldBase' };

const defaultDataProvider = {
    getManyReference: () =>
        Promise.resolve({
            data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
            total: 1,
        }),
} as any;

const Wrapper = ({ children, dataProvider = defaultDataProvider }) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdminContext dataProvider={dataProvider}>
            <ResourceContextProvider value="books">
                <RecordContextProvider
                    value={{ id: 1, title: 'War and Peace' }}
                >
                    {children}
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceOneFieldBase reference="book_details" target="book_id">
            <BookDetails />
        </ReferenceOneFieldBase>
    </Wrapper>
);

const BookDetails = () => {
    const { isPending, error, referenceRecord } = useReferenceFieldContext();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error.toString()}</p>;
    }
    if (!referenceRecord) {
        return <p>No details found</p>;
    }

    return <span>{referenceRecord.ISBN}</span>;
};

const dataProviderWithLoading = {
    getManyReference: () => new Promise(() => {}),
} as any;

export const Loading = () => (
    <Wrapper dataProvider={dataProviderWithLoading}>
        <ReferenceOneFieldBase reference="book_details" target="book_id">
            <BookDetails />
        </ReferenceOneFieldBase>
    </Wrapper>
);

export const WithRenderProp = ({
    dataProvider = defaultDataProvider,
}: {
    dataProvider?: any;
}) => {
    return (
        <Wrapper dataProvider={dataProvider}>
            <ReferenceOneFieldBase
                reference="book_details"
                target="book_id"
                render={({ isPending, error, referenceRecord }) => {
                    if (isPending) {
                        return <p>Loading...</p>;
                    }

                    if (error) {
                        return (
                            <p style={{ color: 'red' }}>{error.toString()}</p>
                        );
                    }
                    return (
                        <span>
                            {referenceRecord ? referenceRecord.ISBN : ''}
                        </span>
                    );
                }}
            />
        </Wrapper>
    );
};
