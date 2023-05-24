import { cosmiconfig } from 'cosmiconfig';

export const detectFeatures = async () => {
    return {
        eslint:
            (await cosmiconfig('eslint', {
                packageProp: 'eslintConfig',
            }).search()) !== null,
        prettier: (await cosmiconfig('prettier').search()) !== null,
    };
};
