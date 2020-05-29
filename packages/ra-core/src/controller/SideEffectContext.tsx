import { createContext } from 'react';

const SideEffectContext = createContext({
    setOnSuccess: () => {},
    setOnFailure: () => null,
});

export default SideEffectContext;
