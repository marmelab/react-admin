import * as React from 'react';
import { ReactElement } from 'react';
import {
    FormGroupContextProvider,
    useRecordContext,
    useResourceContext,
} from 'ra-core';
import { FormInput } from './FormInput';

export const FormTabContent = (props: any) => {
    const {
        children,
        contentClassName,
        hidden,
        margin,
        value,
        variant,
    } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);

    return (
        <FormGroupContextProvider name={value.toString()}>
            <span
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
            >
                {React.Children.map(
                    children,
                    (input: ReactElement) =>
                        input && (
                            <FormInput
                                input={input}
                                record={record}
                                resource={resource}
                                variant={input.props.variant || variant}
                                margin={input.props.margin || margin}
                            />
                        )
                )}
            </span>
        </FormGroupContextProvider>
    );
};

const hiddenStyle = { display: 'none' };
