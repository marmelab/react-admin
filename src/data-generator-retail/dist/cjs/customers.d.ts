export declare const generateCustomers: () => Customer[];
export type Customer = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    zipcode: string;
    city: string;
    stateAbbr: string;
    avatar: string;
    birthday: string | null;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_orders: number;
    total_spent: number;
};
//# sourceMappingURL=customers.d.ts.map