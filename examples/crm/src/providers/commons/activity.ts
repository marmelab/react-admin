import { DataProvider, Identifier } from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
    DEAL_NOTE_CREATED,
} from '../../consts';
import {
    Activity,
    Company,
    Contact,
    ContactNote,
    Deal,
    DealNote,
} from '../../types';

// FIXME: Requires 5 large queries to get the latest activities.
// Replace with a server-side view or a custom API endpoint.
export async function getActivityLog(
    dataProvider: DataProvider,
    companyId?: Identifier,
    salesId?: Identifier
) {
    let companyFilter = {} as any;
    if (companyId) {
        companyFilter.id = companyId;
    } else if (salesId) {
        companyFilter['sales_id@in'] = `(${salesId})`;
    }

    let filter = {} as any;
    if (companyId) {
        filter.company_id = companyId;
    } else if (salesId) {
        filter['sales_id@in'] = `(${salesId})`;
    }

    const [newCompanies, newContactsAndNotes, newDealsAndNotes] =
        await Promise.all([
            getNewCompanies(dataProvider, companyFilter),
            getNewContactsAndNotes(dataProvider, filter),
            getNewDealsAndNotes(dataProvider, filter),
        ]);
    return (
        [...newCompanies, ...newContactsAndNotes, ...newDealsAndNotes]
            // sort by date desc
            .sort((a, b) =>
                a.date && b.date ? a.date.localeCompare(b.date) * -1 : 0
            )
            // limit to 250 activities
            .slice(0, 250)
    );
}

const getNewCompanies = async (
    dataProvider: DataProvider,
    filter: any
): Promise<Activity[]> => {
    const { data: companies } = await dataProvider.getList<Company>(
        'companies',
        {
            filter,
            pagination: { page: 1, perPage: 250 },
            sort: { field: 'created_at', order: 'DESC' },
        }
    );
    return companies.map(company => ({
        id: `company.${company.id}.created`,
        type: COMPANY_CREATED,
        company_id: company.id,
        company,
        sales_id: company.sales_id,
        date: company.created_at,
    }));
};

async function getNewContactsAndNotes(
    dataProvider: DataProvider,
    filter: any
): Promise<Activity[]> {
    const { data: contacts } = await dataProvider.getList<Contact>('contacts', {
        filter,
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'first_seen', order: 'DESC' },
    });

    let recentContactNotesFilter = {} as any;
    if (filter.sales_id) {
        recentContactNotesFilter.sales_id = filter.sales_id;
    }
    if (filter.company_id) {
        // No company_id field in contactNote, filtering by related contacts instead.
        // This filter is only valid if a company has less than 250 contact.
        const contactIds = contacts.map(contact => contact.id).join(',');
        recentContactNotesFilter['contact_id@in'] = `(${contactIds})`;
    }

    const { data: contactNotes } = await dataProvider.getList<ContactNote>(
        'contactNotes',
        {
            filter: recentContactNotesFilter,
            pagination: { page: 1, perPage: 250 },
            sort: { field: 'date', order: 'DESC' },
        }
    );

    const newContacts = contacts.map(contact => ({
        id: `contact.${contact.id}.created`,
        type: CONTACT_CREATED,
        company_id: contact.company_id,
        sales_id: contact.sales_id,
        contact,
        date: contact.first_seen,
    }));

    const newContactNotes = contactNotes.map(contactNote => ({
        id: `contactNote.${contactNote.id}.created`,
        type: CONTACT_NOTE_CREATED,
        sales_id: contactNote.sales_id,
        contactNote,
        date: contactNote.date,
    }));

    return [...newContacts, ...newContactNotes];
}

async function getNewDealsAndNotes(
    dataProvider: DataProvider,
    filter: any
): Promise<Activity[]> {
    const { data: deals } = await dataProvider.getList<Deal>('deals', {
        filter,
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'created_at', order: 'DESC' },
    });

    let recentDealNotesFilter = {} as any;
    if (filter.sales_id) {
        recentDealNotesFilter.sales_id = filter.sales_id;
    }
    if (filter.company_id) {
        // No company_id field in dealNote, filtering by related deals instead.
        // This filter is only valid if a deal has less than 250 notes.
        const dealIds = deals.map(deal => deal.id).join(',');
        recentDealNotesFilter['deal_id@in'] = `(${dealIds})`;
    }

    const { data: dealNotes } = await dataProvider.getList<DealNote>(
        'dealNotes',
        {
            filter: recentDealNotesFilter,
            pagination: { page: 1, perPage: 250 },
            sort: { field: 'date', order: 'DESC' },
        }
    );

    const newDeals = deals.map(deal => ({
        id: `deal.${deal.id}.created`,
        type: DEAL_CREATED,
        company_id: deal.company_id,
        sales_id: deal.sales_id,
        deal,
        date: deal.created_at,
    }));

    const newDealNotes = dealNotes.map(dealNote => ({
        id: `dealNote.${dealNote.id}.created`,
        type: DEAL_NOTE_CREATED,
        sales_id: dealNote.sales_id,
        dealNote,
        date: dealNote.date,
    }));

    return [...newDeals, ...newDealNotes];
}
