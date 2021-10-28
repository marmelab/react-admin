import * as React from 'react';
import {
    SelectInput,
    SelectInputProps,
    useSimpleFormIteratorItem,
} from 'react-admin';
import { useWatch } from 'react-hook-form';

export const RoleSelectInput = (props: SelectInputProps) => {
    const { index } = useSimpleFormIteratorItem();
    const user_id = useWatch({ name: `authors.${index}.user_id` });
    return user_id ? (
        <SelectInput
            label="Role"
            choices={[
                {
                    id: 'headwriter',
                    name: 'Head Writer',
                },
                {
                    id: 'proofreader',
                    name: 'Proof reader',
                },
                {
                    id: 'cowriter',
                    name: 'Co-Writer',
                },
            ]}
            {...props}
        />
    ) : null;
};
