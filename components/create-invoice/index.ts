import { InvoiceProvider, useInvoice } from './invoice-context';
import { InvoiceDetails } from './invoice-details';
import { CustomerDetails } from './customer-details';
import { ItemsSection } from './items-section';
import { InvoiceSummary } from './invoice-summary';
import { NotesSection } from './notes-section';

export const Invoice = {
    Provider: InvoiceProvider,
    useInvoice,
    Details: InvoiceDetails,
    PartyDetails: CustomerDetails,
    ItemsSection,
    Summary: InvoiceSummary,
    Notes: NotesSection,
};
