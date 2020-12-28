import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ReferenceArrayInputView } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        input: {},
        meta: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        translate: x => `*${x}*`,
    };

    it("should not render a progress bar if loading is true and a second hasn't passed", async () => {
        const MyComponent = () => <div>MyComponent</div>;
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    loading: true,
                    input: {},
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        await new Promise(resolve => setTimeout(resolve, 250));
        expect(queryByRole('progressbar')).toBeNull();
        expect(queryByText('MyComponent')).toBeNull();
    });

    it('should render a progress bar if loading is true and a second has passed', async () => {
        const MyComponent = () => <div>MyComponent</div>;
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    loading: true,
                    input: {},
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        await new Promise(resolve => setTimeout(resolve, 1001));
        expect(queryByRole('progressbar')).not.toBeNull();
        expect(queryByText('MyComponent')).toBeNull();
    });

    it('should display an error if error is defined', () => {
        const MyComponent = () => <div>MyComponent</div>;
        const { queryByDisplayValue, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    error: 'error',
                    input: {},
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByDisplayValue('error')).not.toBeNull();
        expect(queryByText('MyComponent')).toBeNull();
    });

    it('should send an error to the children if warning is defined', () => {
        const MyComponent = ({ meta }) => <div>{meta.helperText}</div>;
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    input: { value: [1, 2] },
                    choices: [{ id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText('fetch error')).not.toBeNull();
    });

    it('should not send an error to the children if warning is not defined', () => {
        const MyComponent = ({ meta }) => <div>{JSON.stringify(meta)}</div>;
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    input: { value: [1, 2] },
                    choices: [{ id: 1 }, { id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(
            queryByText(JSON.stringify({ helperText: false }))
        ).not.toBeNull();
    });

    it('should render enclosed component if references present in input are available in state', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    input: { value: [1] },
                    choices: [1],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([1]))).not.toBeNull();
    });

    it('should render enclosed component even if the choices are empty', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    choices: [],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('progressbar')).toBeNull();
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([]))).not.toBeNull();
    });

    it('should pass onChange down to child component', () => {
        let onChangeCallback;
        const MyComponent = ({ onChange }) => {
            onChangeCallback = onChange;
            return <div />;
        };
        const onChange = jest.fn();
        render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        onChangeCallback('foo');
        expect(onChange).toBeCalledWith('foo');
    });

    it('should pass meta down to child component', () => {
        const MyComponent = ({ meta }) => <div>{JSON.stringify(meta)}</div>;
        const { queryByText } = render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                meta={{ touched: false }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(
            queryByText(JSON.stringify({ touched: false, helperText: false }))
        ).not.toBeNull();
    });
});
