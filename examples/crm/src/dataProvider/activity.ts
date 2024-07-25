import { DataProvider, Identifier } from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
    DEAL_NOTE_CREATED,
} from '../consts';
import {
    Activity,
    Company,
    Contact,
    ContactNote,
    Deal,
    DealNote,
    Sale,
} from '../types';

export async function getActivityLog(
    dataProvider: DataProvider,
    companyId?: Identifier
) {
    const sales = await getSales(dataProvider);
    const companies = await getCompaniesLog(dataProvider, sales, companyId);

    const [contactsLog, dealsLog] = await Promise.all([
        getContactsLog(dataProvider, sales, companies),
        getDealsLog(dataProvider, sales, companies),
    ]);

    return companies.companiesLog.concat(contactsLog, dealsLog).sort(
        (a, b) => a.date.localeCompare(b.date) * -1 // sort by date desc
    );
}

async function getSales(dataProvider: DataProvider) {
    const salesDict = await dataProvider
        .getList<Sale>('sales', {
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'id', order: 'ASC' },
        })
        .then(({ data }) =>
            data.reduce((acc, sale) => {
                acc.set(sale.id, sale);
                return acc;
            }, new Map<Identifier, Sale>())
        );

    return {
        salesDict,
        salesIds: [...salesDict.keys()],
    };
}

async function getCompaniesLog(
    dataProvider: DataProvider,
    { salesDict, salesIds }: Awaited<ReturnType<typeof getSales>>,
    companyId?: Identifier
) {
    const companies = await dataProvider
        .getList<Company>('companies', {
            filter: { id: companyId, sales_id: salesIds },
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'created_at', order: 'DESC' },
        })
        .then(({ data }) => data);

    return {
        companiesLog: companies.map<Activity>(company => ({
            id: `company.${company.id}.created`,
            type: COMPANY_CREATED,
            company,
            sale: salesDict.get(company.sales_id) as Sale,
            date: company.created_at,
        })),
        companiesIds: companies.map(({ id }) => id),
        companiesDict: companies.reduce((acc, company) => {
            acc.set(company.id, company);
            return acc;
        }, new Map<Identifier, Company>()),
    };
}

async function getContactsLog(
    dataProvider: DataProvider,
    { salesDict, salesIds }: Awaited<ReturnType<typeof getSales>>,
    { companiesIds, companiesDict }: Awaited<ReturnType<typeof getCompaniesLog>>
) {
    const contacts = await dataProvider
        .getList<Contact>('contacts', {
            filter: {
                company_id: companiesIds,
                sales_id: salesIds,
            },
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'first_seen', order: 'DESC' },
        })
        .then(({ data }) => data);

    const contactsDict = contacts.reduce((acc, contact) => {
        acc.set(contact.id, contact);
        return acc;
    }, new Map<Identifier, Contact>());

    const contactNotes = await dataProvider
        .getList<ContactNote>('contactNotes', {
            filter: {
                contact_id: contacts.map(({ id }) => id),
                sales_id: salesIds,
            },
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'date', order: 'DESC' },
        })
        .then(({ data }) => data);

    return contacts
        .map<Activity>(contact => ({
            id: `contact.${contact.id}.created`,
            type: CONTACT_CREATED,
            company: companiesDict.get(contact.company_id) as Company,
            sale: salesDict.get(contact.sales_id) as Sale,
            contact,
            date: contact.first_seen,
        }))
        .concat(
            contactNotes.map<Activity>(contactNote => ({
                id: `contactNote.${contactNote.id}.created`,
                type: CONTACT_NOTE_CREATED,
                sale: salesDict.get(contactNote.sales_id) as Sale,
                contact: contactsDict.get(contactNote.contact_id) as Contact,
                contactNote,
                date: contactNote.date,
            }))
        );
}

async function getDealsLog(
    dataProvider: DataProvider,
    { salesDict, salesIds }: Awaited<ReturnType<typeof getSales>>,
    { companiesIds, companiesDict }: Awaited<ReturnType<typeof getCompaniesLog>>
) {
    const deals = await dataProvider
        .getList<Deal>('deals', {
            filter: {
                company_id: companiesIds,
                sales_id: salesIds,
            },
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'created_at', order: 'DESC' },
        })
        .then(({ data }) => data);

    const dealsDict = deals.reduce((acc, deals) => {
        acc.set(deals.id, deals);
        return acc;
    }, new Map<Identifier, Deal>());

    const dealsNotes = await dataProvider
        .getList<DealNote>('dealNotes', {
            filter: {
                deal_id: deals.map(({ id }) => id),
                sales_id: salesIds,
            },
            pagination: { page: 1, perPage: 10_000 },
            sort: { field: 'date', order: 'DESC' },
        })
        .then(({ data }) => data);

    return deals
        .map<Activity>(deal => ({
            id: `deal.${deal.id}.created`,
            type: DEAL_CREATED,
            company: companiesDict.get(deal.company_id) as Company,
            sale: salesDict.get(deal.sales_id) as Sale,
            deal,
            date: deal.created_at,
        }))
        .concat(
            dealsNotes.map<Activity>(dealNote => {
                const deal = dealsDict.get(dealNote.deal_id) as Deal;
                return {
                    id: `dealNote.${dealNote.id}.created`,
                    type: DEAL_NOTE_CREATED,
                    company: companiesDict.get(deal.company_id) as Company,
                    sale: salesDict.get(dealNote.sales_id) as Sale,
                    deal,
                    dealNote,
                    date: dealNote.date,
                };
            })
        );
}
