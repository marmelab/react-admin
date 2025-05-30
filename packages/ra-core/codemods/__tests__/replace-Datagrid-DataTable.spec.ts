import { defineTest } from 'jscodeshift/dist/testUtils';

jest.autoMockOff();

defineTest(
    __dirname,
    'replace-Datagrid-DataTable',
    null,
    'replace-Datagrid-DataTable-Basic',
    { parser: 'tsx' }
);
defineTest(
    __dirname,
    'replace-Datagrid-DataTable',
    null,
    'replace-Datagrid-DataTable-ManyChildren',
    { parser: 'tsx' }
);
defineTest(
    __dirname,
    'replace-Datagrid-DataTable',
    null,
    'replace-Datagrid-DataTable-Props',
    { parser: 'tsx' }
);
