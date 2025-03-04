import { Db } from './types';
export default function (db: Db): void;
export type Settings = {
    id: number;
    configuration: {
        url: string;
        mail: {
            sender: string;
            transport: {
                service: string;
                auth: {
                    user: string;
                    pass: string;
                };
            };
        };
        file_type_whiltelist: string[];
    };
}[];
//# sourceMappingURL=finalize.d.ts.map