import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { ReferenceInputView } from './ReferenceInput';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        possibleValues: {
            basePath: '',
            data: {},
            ids: [],
            total: 0,
            loaded: true,
            loading: false,
            hasCreate: false,
            page: 1,
            setPage: () => {},
            perPage: 25,
            setPerPage: () => {},
            currentSort: {},
            setSort: () => {},
            filterValues: {},
            displayedFilters: [],
            setFilters: () => {},
            showFilter: () => {},
            hideFilter: () => {},
            selectedIds: [],
            onSelect: () => {},
            onToggleItem: () => {},
            onUnselectItems: () => {},
            resource: 'comments',
        },
        referenceRecord: {
            data: {},
            loaded: true,
            loading: false,
        },
        dataStatus: {
            loading: false,
        },
        allowEmpty: false,
        basePath: '/posts',
        meta: {},
        input: {},
        label: '',
        record: {},
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        choices: [],
        id: 'post_id',
        isRequired: false,
        setFilter: jest.fn(),
        setPagination: jest.fn(),
        setSort: jest.fn(),
        loading: false,
    };
    const MyComponent = () => <span id="mycomponent" />;

    afterEach(cleanup);

    it('should render a LinearProgress if loading is true and a second has passed', async () => {
        const { queryByRole } = render(
            <ReferenceInputView
                {...{
                    ...defaultProps,
                    input: { value: 1 },
                    loading: true,
                }}
            >
                <MyComponent />
            </ReferenceInputView>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));
        expect(queryByRole('progressbar')).not.toBeNull();
    });

    it("should not render a LinearProgress if loading is true and a second hasn't passed", async () => {
        const { queryByRole } = render(
            <ReferenceInputView
                {...{
                    ...defaultProps,
                    input: { value: 1 },
                    loading: true,
                }}
            >
                <MyComponent />
            </ReferenceInputView>
        );

        await new Promise(resolve => setTimeout(resolve, 250));
        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should not render a LinearProgress if loading is false', () => {
        const { queryByRole } = render(
            <ReferenceInputView
                {...{
                    ...defaultProps,
                    choices: [{ id: 1 }],
                    input: { value: 1 },
                }}
            >
                <MyComponent />
            </ReferenceInputView>
        );

        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should display an error if error is defined', () => {
        const { queryByDisplayValue } = render(
            <ReferenceInputView
                {...{
                    ...defaultProps,
                    error: 'fetch error',
                    input: { value: 1 },
                }}
            >
                <MyComponent />
            </ReferenceInputView>
        );
        expect(queryByDisplayValue('fetch error')).not.toBeNull();
    });

    it('should pass warning as error to the children if defined', () => {
        const Component = ({ meta = { error: null } }) => meta.error;

        const { queryByText } = render(
            <ReferenceInputView
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    choices: [{ id: 1 }],
                    input: { value: 1 },
                }}
            >
                <Component />
            </ReferenceInputView>
        );

        expect(queryByText('fetch error')).not.toBeNull();
    });
});
