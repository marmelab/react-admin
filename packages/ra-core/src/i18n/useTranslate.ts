import { useContext } from 'react';

import { TranslationContext } from './TranslationContext';

const useTranslate = () => {
    const { translate } = useContext(TranslationContext);
    return translate;
};

export default useTranslate;
