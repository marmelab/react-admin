import { useFieldValue } from 'ra-core';
import * as React from 'react';
import { ReactNode } from 'react';

import { Chip, ChipProps, Stack, StackProps } from '@mui/material';
import { FieldProps } from './types';

/**
 * Renders an array of scalar values using MUI Stack and Chips.
 *
 * @example
 * // const post = {
 * //   id: 123
 * //   genres: [
 * //     'Fiction',
 * //     'Historical Fiction',
 * //     'Classic Literature',
 * //     'Russian Literature',
 * //   ]
 * // };
 * const PostShow = () => (
 *    <Show>
 *       <SimpleShowLayout>
 *           <TextArrayField source="genres" />
 *      </SimpleShowLayout>
 *   </Show>
 * );
 */
export const TextArrayField = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: TextArrayFieldProps<RecordType>
) => {
    const {
        emptyText,
        source,
        record,
        resource,
        size = 'small',
        color,
        variant,
        ...rest
    } = props;
    const data = useFieldValue(props) || emptyArray;
    return (
        <Stack
            direction="row"
            {...rest}
            sx={{ gap: 1, flexWrap: 'wrap', ...rest.sx }}
        >
            {data.length === 0
                ? emptyText
                : data.map((item: ReactNode, index: number) => (
                      <Chip
                          key={index}
                          label={item}
                          size={size}
                          color={color}
                          variant={variant}
                      />
                  ))}
        </Stack>
    );
};

export interface TextArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<StackProps, 'textAlign' | 'color'>,
        Pick<ChipProps, 'size' | 'color' | 'variant'> {}

const emptyArray = [];
