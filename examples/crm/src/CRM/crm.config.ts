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

const dealCategories = [
    'Other',
    'Copywriting',
    'Print project',
    'UI Design',
    'Website design',
];

const noteStatuses = [
    { value: 'cold', label: 'Cold', color: '#7dbde8' },
    { value: 'warm', label: 'Warm', color: '#e8cb7d' },
    { value: 'hot', label: 'Hot', color: '#e88b7d' },
    { value: 'in-contract', label: 'In Contract', color: '#a4e87d' },
];

const taskTypes = [
    'None',
    'Email',
    'Demo',
    'Lunch',
    'Meeting',
    'Follow-up',
    'Thank you',
    'Ship',
    'Call',
];

export const crmConfig = {
    logo,
    title,
    companySectors,
    dealStages,
    dealCategories,
    noteStatuses,
    taskTypes,
};
