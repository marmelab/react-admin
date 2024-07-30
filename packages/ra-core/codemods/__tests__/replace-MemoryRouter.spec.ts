import { defineTest } from 'jscodeshift/dist/testUtils';

jest.autoMockOff();

defineTest(
    __dirname,
    'replace-MemoryRouter',
    null,
    'replace-MemoryRouter-useEditController',
    { parser: 'tsx' }
);
