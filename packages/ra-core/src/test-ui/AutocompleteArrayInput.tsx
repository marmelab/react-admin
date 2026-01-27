import * as React from 'react';
import type { InputProps } from '../form/useInput';
import type { ChoicesProps } from '../form/choices/useChoices';
import { AutocompleteInput } from './AutocompleteInput';

export const AutocompleteArrayInput = (
    props: Partial<InputProps> & Partial<ChoicesProps> & { multiple?: boolean }
) => {
    return <AutocompleteInput {...props} multiple={true} />;
};
