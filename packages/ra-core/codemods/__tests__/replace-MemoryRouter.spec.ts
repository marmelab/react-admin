import { defineTest } from 'jscodeshift/dist/testUtils';

vi.autoMockOff();

defineTest(
    __dirname,
    'replace-MemoryRouter',
    null,
    'replace-MemoryRouter-useEditController',
    { parser: 'tsx' }
);
