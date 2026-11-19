import { mergeHtmlInputSlotProps } from './ResettableTextField';

const ARIA_REQUIRED_PROPS = { 'aria-required': true };
const CUSTOM_PROPS = { 'data-custom': 'kept' };
const OWNER_STATE = { disabled: false };

describe('mergeHtmlInputSlotProps', () => {
    it('should preserve callback slot props', () => {
        const slotProps = jest.fn().mockReturnValue(CUSTOM_PROPS);
        const mergedSlotProps = mergeHtmlInputSlotProps(
            ARIA_REQUIRED_PROPS,
            slotProps
        );

        expect(mergedSlotProps).toBeInstanceOf(Function);
        expect(
            (mergedSlotProps as (ownerState: typeof OWNER_STATE) => object)(
                OWNER_STATE
            )
        ).toEqual({ ...ARIA_REQUIRED_PROPS, ...CUSTOM_PROPS });
        expect(slotProps).toHaveBeenCalledWith(OWNER_STATE);
    });

    it('should keep required state above object slot props', () => {
        const mergedSlotProps = mergeHtmlInputSlotProps(
            ARIA_REQUIRED_PROPS,
            { ...CUSTOM_PROPS, 'aria-required': false },
            true
        );

        expect(mergedSlotProps).toEqual({
            ...CUSTOM_PROPS,
            'aria-required': true,
        });
    });

    it('should keep required state above callback slot props', () => {
        const slotProps = jest.fn().mockReturnValue({
            ...CUSTOM_PROPS,
            'aria-required': false,
        });
        const mergedSlotProps = mergeHtmlInputSlotProps(
            ARIA_REQUIRED_PROPS,
            slotProps,
            true
        );

        expect(
            (mergedSlotProps as (ownerState: typeof OWNER_STATE) => object)(
                OWNER_STATE
            )
        ).toEqual({ ...CUSTOM_PROPS, 'aria-required': true });
        expect(slotProps).toHaveBeenCalledWith(OWNER_STATE);
    });
});
