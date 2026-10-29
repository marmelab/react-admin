import { type Ref } from 'react';
import { useForkRef, major as muiMajor } from '@mui/material';

/**
 * Get the props to spread on a Switch or Checkbox, with a ref forwarded to its <input>
 * and merged with the inputRef or slotProps.input.ref passed by the user.
 *
 * MUI v9 removed the inputRef prop, so we must use slotProps.input.ref instead.
 */
export const useSwitchBaseInputRefProps = <
    Props extends { inputRef?: Ref<HTMLInputElement>; slotProps?: any },
>(
    ref: Ref<HTMLInputElement> | undefined,
    { inputRef, ...props }: Props
) => {
    const forkedRef = useForkRef(
        ref,
        muiMajor < 9 ? inputRef : props.slotProps?.input?.ref
    );
    return muiMajor < 9
        ? { ...props, inputRef: forkedRef }
        : {
              ...props,
              slotProps: {
                  ...props.slotProps,
                  input: { ...props.slotProps?.input, ref: forkedRef },
              },
          };
};
