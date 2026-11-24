import { defaultExporter } from './defaultExporter';
import { downloadCSV } from './downloadCSV';

jest.mock('./downloadCSV', () => ({ downloadCSV: jest.fn() }));

const exportToCsv = (records: any[]): string => {
    (downloadCSV as jest.Mock).mockClear();
    defaultExporter(records, jest.fn(), {} as any, 'posts');
    return (downloadCSV as jest.Mock).mock.calls[0][0];
};

describe('defaultExporter', () => {
    it('should export records as CSV', () => {
        expect(
            exportToCsv([
                { id: 1, title: 'Hello', views: -5, price: '-1.5' },
                { id: 2, title: 'World, "quoted"', views: 3, price: '+2' },
            ])
        ).toEqual(
            '"id","title","views","price"\n"1","Hello","-5","-1.5"\n"2","World, ""quoted""","3","+2"'
        );
        expect((downloadCSV as jest.Mock).mock.calls[0][1]).toEqual('posts');
    });

    it('should prefix with a quote the values and headers starting with =, +, -, @ or a tab', () => {
        expect(
            exportToCsv([
                {
                    id: 1,
                    name: '== Title ==',
                    phone: '+33 6 12 34 56 78',
                    handle: '@alice',
                    '-note': '\t-x',
                },
            ]).split('\n')
        ).toEqual([
            `"id","name","phone","handle","'-note"`,
            `"1","'== Title ==","'+33 6 12 34 56 78","'@alice","'\t-x"`,
        ]);
    });

    it('should quote the values containing another separator', () => {
        expect(exportToCsv([{ id: 1, name: 'foo;=bar' }])).toEqual(
            '"id","name"\n"1","foo;=bar"'
        );
    });

    it('should quote the values containing a lone carriage return', () => {
        expect(exportToCsv([{ id: 1, name: 'Bob\r2', role: 'admin' }])).toEqual(
            '"id","name","role"\n"1","Bob\r2","admin"'
        );
    });

    it('should quote the column headers coming from record keys', () => {
        const csv = exportToCsv([
            {
                id: 1,
                title: 'Hello',
                meta: { 'x\ny,z': true, 'a,b': 1 },
                'say "hi"': 3,
            },
        ]);
        expect(csv.split('\n')).toEqual([
            '"id","title","meta.x',
            'y,z","meta.a,b","say ""hi"""',
            '"1","Hello","true","1","3"',
        ]);
    });
});
