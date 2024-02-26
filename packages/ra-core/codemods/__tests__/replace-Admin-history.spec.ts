import { defineTest } from 'jscodeshift/dist/testUtils';

jest.autoMockOff();

defineTest(
    __dirname,
    'replace-Admin-history',
    null,
    'replace-Admin-history-Authenticated',
    { parser: 'tsx' }
);
