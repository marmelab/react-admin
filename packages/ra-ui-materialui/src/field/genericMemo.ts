import { memo } from 'react';

/**
 * A version of React.memo that preserves the original component type allowing it to accept generics.
 * See {@link https://stackoverflow.com/a/70890101}
 */
export const genericMemo: <T>(component: T) => T = memo;
