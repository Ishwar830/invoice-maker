'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserIcon, PhoneIcon, MapPinIcon, HashIcon } from 'lucide-react';
import { useInvoice } from './invoice-context';
import { SectionHeader } from './section-header';
import { FormField } from './form-field';

export function CustomerDetails({ partyLabel = 'Customer' }: { partyLabel?: string }) {
    const {
        state: { invoiceData },
        actions: { updateCustomer },
    } = useInvoice();

    return (
        <section className="invoice-section rounded-lg border border-border/60 bg-card p-6 shadow-sm">
            <SectionHeader
                icon={<UserIcon className="size-4 text-[#D4AF37]" />}
                title={`${partyLabel} Details`}
            />
            <div className="mt-5 space-y-4">
                <FormField
                    label="Name"
                    icon={
                        <UserIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Input
                        id="customer-name"
                        placeholder={`${partyLabel} name`}
                        value={invoiceData.customer.name}
                        onChange={(e) => updateCustomer('name', e.target.value)}
                        className="text-sm"
                    />
                </FormField>
                <FormField
                    label="Phone"
                    icon={
                        <PhoneIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Input
                        id="customer-phone"
                        placeholder="+91 98765 43210"
                        value={invoiceData.customer.phone ?? ''}
                        onChange={(e) =>
                            updateCustomer('phone', e.target.value)
                        }
                        className="text-sm"
                    />
                </FormField>
                <FormField
                    label="GST No."
                    icon={
                        <HashIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Input
                        id="customer-gst-number"
                        className="text-sm"
                        value={invoiceData.customer.gstNumber ?? ''}
                        placeholder="27ABCDE1234F1Z5"
                        onChange={(e) =>
                            updateCustomer('gstNumber', e.target.value)
                        }
                    />
                </FormField>
                <FormField
                    label="Address"
                    icon={
                        <MapPinIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Textarea
                        id="customer-address"
                        placeholder={`${partyLabel} address`}
                        value={invoiceData.customer.address ?? ''}
                        onChange={(e) =>
                            updateCustomer('address', e.target.value)
                        }
                        className="min-h-15 text-sm"
                        rows={2}
                    />
                </FormField>
            </div>
        </section>
    );
}
