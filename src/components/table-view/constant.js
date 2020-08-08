export const TABLE_COLUMN = [{
    label: "Name",
    id: "contact_name"
}, {
    label: "Company Name",
    id: "company_name"
}, {
    label: "Email",
    id: "email"
}, {
    label: "Work Phone",
    id: "mobile",
    numeric: true
}, {
    label: "GST Treatment",
    id: "gst_no"
}, {
    label: "Receivables",
    id: "outstanding_receivable_amount",
    numeric: true,
    float: true,
    symbol: '₹'
}, {
    label: "Payable",
    id: "outstanding_payable_amount",
    numeric: true,
    float: true,
    symbol: '₹'
}];

export const API_CONFIG = {
    BASE_URL: window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/',
    ENDPOINTS: {
        CONTACTS: 'contacts'
    }
};

export const FILTER_OPTIONS = [{
    label: 'All Contacts',
    value: 'Status.All'
},{
    label: 'Active Contacts',
    value: 'Status.Active'
},{
    label: 'Inactive Contacts',
    value: 'Status.Inactive'
},{
    label: 'Duplicate Contacts',
    value: 'Status.Duplicate'
},{
    label: 'Crm Contacts',
    value: 'Status.Crm'
}]