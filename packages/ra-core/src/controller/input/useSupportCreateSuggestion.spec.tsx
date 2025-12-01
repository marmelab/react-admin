import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UseSupportCreateSuggestion } from './useSupportCreateSuggestion.stories';

describe('useSupportCreateSuggestion', () => {
    it('returns a createId and a createHintId', async () => {
        render(<UseSupportCreateSuggestion />);
        await screen.findByText('"createId": "@@ra-create"', { exact: false });
        await screen.findByText('"createHintId": "@@ra-create-hint"', {
            exact: false,
        });
    });

    it('returns a custom createId when createValue is provided', async () => {
        render(<UseSupportCreateSuggestion createValue="@@my-id" />);
        await screen.findByText('"createId": "@@my-id"', { exact: false });
        await screen.findByText('"createHintId": "@@ra-create-hint"', {
            exact: false,
        });
    });

    it('returns a custom createHintId when createHintValue is provided', async () => {
        render(<UseSupportCreateSuggestion createHintValue="@@my-id" />);
        await screen.findByText('"createId": "@@ra-create"', { exact: false });
        await screen.findByText('"createHintId": "@@my-id"', {
            exact: false,
        });
    });

    it('returns a createItem with id and name', async () => {
        render(<UseSupportCreateSuggestion />);
        await screen.findByText('"id": "@@ra-create"', { exact: false });
        await screen.findByText('"name": "ra.action.create"', {
            exact: false,
        });
        await screen.findByText('"disabled": false', { exact: false });
    });

    it("returns a createItem with id and label when optionText is 'label'", async () => {
        render(<UseSupportCreateSuggestion optionText="label" />);
        await screen.findByText('"id": "@@ra-create"', { exact: false });
        await screen.findByText('"label": "ra.action.create"', {
            exact: false,
        });
    });

    it('returns a createItem with custom name when createLabel is provided', async () => {
        render(<UseSupportCreateSuggestion createLabel="Create a new item" />);
        await screen.findByText('"id": "@@ra-create"', { exact: false });
        await screen.findByText('"name": "Create a new item"', {
            exact: false,
        });
    });

    it('returns a hint as createItem when createItemLabel is provided and no filter is set', async () => {
        render(
            <UseSupportCreateSuggestion createItemLabel="Create a new item called %{item}" />
        );
        await screen.findByText('"id": "@@ra-create-hint"', { exact: false });
        await screen.findByText('"name": "ra.action.create"', {
            exact: false,
        });
        await screen.findByText('"disabled": true', { exact: false });
    });

    it('uses the filter in the createItem name when createItemLabel is provided', async () => {
        render(
            <UseSupportCreateSuggestion createItemLabel="Create a new item called %{item}" />
        );
        fireEvent.change(await screen.findByLabelText('Autocomplete filter'), {
            target: { value: 'foo' },
        });
        await screen.findByText('"id": "@@ra-create"', { exact: false });
        await screen.findByText('"name": "Create a new item called foo"', {
            exact: false,
        });
        await screen.findByText('"disabled": false', { exact: false });
    });

    it('calls onCreate with the filter when the createItem is clicked', async () => {
        render(<UseSupportCreateSuggestion />);
        fireEvent.change(await screen.findByLabelText('Autocomplete filter'), {
            target: { value: 'foo' },
        });
        fireEvent.click(await screen.findByText('Simulate click on create'));
        await screen.findByText('"foo"');
    });

    it('renders the create element with the filter as default value when the createItem is clicked', async () => {
        render(<UseSupportCreateSuggestion withCreateElement />);
        fireEvent.change(await screen.findByLabelText('Autocomplete filter'), {
            target: { value: 'foo' },
        });
        fireEvent.click(await screen.findByText('Simulate click on create'));
        await screen.findByLabelText('resources.authors.fields.foo');
        await screen.findByLabelText('resources.authors.fields.bar');
        // We expect 2 inputs with value 'foo': the filter input and the input in the create element
        expect(screen.getAllByDisplayValue('foo')).toHaveLength(2);
    });

    it("calls create with the new element's data when the create element's form is submitted", async () => {
        render(<UseSupportCreateSuggestion withCreateElement />);
        fireEvent.change(await screen.findByLabelText('Autocomplete filter'), {
            target: { value: 'foo' },
        });
        fireEvent.click(await screen.findByText('Simulate click on create'));
        fireEvent.change(
            await screen.findByLabelText('resources.authors.fields.bar'),
            { target: { value: 'baz' } }
        );
        fireEvent.click(await screen.findByText('ra.action.save'));
        await screen.findByText('"foo": "foo"', { exact: false });
        await screen.findByText('"bar": "baz"', { exact: false });
    });

    it('hides the create element when the cancel button is clicked', async () => {
        render(<UseSupportCreateSuggestion withCreateElement />);
        fireEvent.click(await screen.findByText('Simulate click on create'));
        await screen.findByLabelText('resources.authors.fields.foo');
        await screen.findByLabelText('resources.authors.fields.bar');
        fireEvent.click(await screen.findByText('Cancel'));
        expect(
            screen.queryByLabelText('resources.authors.fields.foo')
        ).toBeNull();
        expect(
            screen.queryByLabelText('resources.authors.fields.bar')
        ).toBeNull();
    });
});
