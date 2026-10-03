import type { BillingInfoData } from './billing-info';

export const BANK_DETAILS = {
    name: 'Kotak Mahindra Bank',
    branch: 'AmberNath East',
    ifscCode: 'KKBK0002040',
    accountNumber: 9833865787,
} as const;

export const SHOP_BILLING: BillingInfoData = {
    name: 'Krishna Jewellers',
    phone: ['9833865787', '9699555400'].join(' | '),
    gstNumber: '27AAYFK4850G1ZS',
    address:
        'Shop No 2, Nirmala Niwas, Patil Colony, ChinchPada, Ambernath West, Maharashtra, 421505',
};
