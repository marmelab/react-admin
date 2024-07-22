const logo =
    'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';
const title = 'Atomic CRM';

const companySectors = [
    'Communication Services',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Financials',
    'Health Care',
    'Industrials',
    'Information Technology',
    'Materials',
    'Real Estate',
    'Utilities',
];

const dealStages = [
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'proposal-sent', label: 'Proposal Sent' },
    { value: 'in-negociation', label: 'In Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
    { value: 'delayed', label: 'Delayed' },
];

export const crmConfig = {
    logo,
    title,
    companySectors,
    dealStages,
};
