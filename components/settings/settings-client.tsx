'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StoreIcon, LandmarkIcon, SaveIcon, RotateCcwIcon, Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { updateAllSettingsAction } from '@/app/actions/settings';
import type { ShopProfile } from '@/lib/types';

interface SettingsClientProps {
    shop: ShopProfile | null;
}

export function SettingsClient({ shop }: SettingsClientProps) {
    const router = useRouter();

    // Shop State
    const [shopName, setShopName] = useState(shop?.name ?? '');
    const [ownerName, setOwnerName] = useState(shop?.ownerName ?? '');
    const [phone, setPhone] = useState(shop?.phone ?? '');
    const [gstNumber, setGstNumber] = useState(shop?.gstNumber ?? '');
    const [address, setAddress] = useState(shop?.address ?? '');

    // Bank State
    const [bankName, setBankName] = useState(
        shop?.bankDetails?.bankName ?? shop?.bankName ?? ''
    );
    const [bankBranch, setBankBranch] = useState(
        shop?.bankDetails?.bankBranch ?? shop?.bankBranch ?? ''
    );
    const [bankIfsc, setBankIfsc] = useState(
        shop?.bankDetails?.bankIfsc ?? shop?.bankIfsc ?? ''
    );
    const [bankAccountNumber, setBankAccountNumber] = useState(
        shop?.bankDetails?.bankAccountNumber ?? shop?.bankAccountNumber ?? ''
    );

    // Initial state for dirty tracking & reset
    const initialValues = {
        name: shop?.name ?? '',
        ownerName: shop?.ownerName ?? '',
        phone: shop?.phone ?? '',
        gstNumber: shop?.gstNumber ?? '',
        address: shop?.address ?? '',
        bankName: shop?.bankDetails?.bankName ?? shop?.bankName ?? '',
        bankBranch: shop?.bankDetails?.bankBranch ?? shop?.bankBranch ?? '',
        bankIfsc: shop?.bankDetails?.bankIfsc ?? shop?.bankIfsc ?? '',
        bankAccountNumber:
            shop?.bankDetails?.bankAccountNumber ?? shop?.bankAccountNumber ?? '',
    };

    const isDirty =
        shopName !== initialValues.name ||
        ownerName !== initialValues.ownerName ||
        phone !== initialValues.phone ||
        gstNumber !== initialValues.gstNumber ||
        address !== initialValues.address ||
        bankName !== initialValues.bankName ||
        bankBranch !== initialValues.bankBranch ||
        bankIfsc !== initialValues.bankIfsc ||
        bankAccountNumber !== initialValues.bankAccountNumber;

    const [isSaving, startSaving] = useTransition();
    const [errors, setErrors] = useState<{
        shop?: Record<string, string[]>;
        bank?: Record<string, string[]>;
    }>({});

    const handleReset = () => {
        setShopName(initialValues.name);
        setOwnerName(initialValues.ownerName);
        setPhone(initialValues.phone);
        setGstNumber(initialValues.gstNumber);
        setAddress(initialValues.address);

        setBankName(initialValues.bankName);
        setBankBranch(initialValues.bankBranch);
        setBankIfsc(initialValues.bankIfsc);
        setBankAccountNumber(initialValues.bankAccountNumber);

        setErrors({});
        toast.info('Changes discarded.');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!shopName.trim()) {
            setErrors({ shop: { name: ['Shop name is required.'] } });
            toast.error('Shop name is required.');
            return;
        }

        setErrors({});

        startSaving(async () => {
            const res = await updateAllSettingsAction({
                shop: {
                    name: shopName,
                    ownerName,
                    phone,
                    gstNumber,
                    address,
                },
                bank: {
                    bankName,
                    bankBranch,
                    bankIfsc,
                    bankAccountNumber,
                },
            });

            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                if (res.errors) {
                    setErrors({ shop: res.errors });
                }
                toast.error(res.message);
            }
        });
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: Shop Profile */}
            <Card className="border border-border/60 shadow-xs">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <StoreIcon className="size-4" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">
                                Shop Profile
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Business details printed at the top of your
                                invoices.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Shop Name */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="shop-name"
                            className="text-xs font-medium"
                        >
                            Shop Name{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="shop-name"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="e.g., Krishna Jewellers"
                            maxLength={200}
                            className={cn(
                                'h-9 text-sm',
                                errors.shop?.name && 'border-destructive'
                            )}
                        />
                        {errors.shop?.name && (
                            <p className="text-[11px] text-destructive font-medium">
                                {errors.shop.name[0]}
                            </p>
                        )}
                    </div>

                    {/* Owner Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="owner-name"
                                className="text-xs font-medium"
                            >
                                Owner Name
                            </Label>
                            <Input
                                id="owner-name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                placeholder="e.g., Ramesh Suthar"
                                maxLength={200}
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="shop-phone"
                                className="text-xs font-medium"
                            >
                                Phone Number
                            </Label>
                            <Input
                                id="shop-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g., 9876543210"
                                maxLength={50}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* GSTIN */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="gst-number"
                            className="text-xs font-medium"
                        >
                            GST Number
                        </Label>
                        <Input
                            id="gst-number"
                            value={gstNumber}
                            onChange={(e) =>
                                setGstNumber(e.target.value.toUpperCase())
                            }
                            placeholder="e.g., 24ABCDE1234F1Z5"
                            maxLength={20}
                            className="h-9 font-mono uppercase text-sm"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="shop-address"
                            className="text-xs font-medium"
                        >
                            Address
                        </Label>
                        <Textarea
                            id="shop-address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g., Station Road, Palanpur, Gujarat - 385001"
                            rows={3}
                            maxLength={500}
                            className="text-sm min-h-18"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Bank Details */}
            <Card className="border border-border/60 shadow-xs">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <LandmarkIcon className="size-4" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">
                                Bank Details
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Payment information printed at the bottom of
                                your invoices.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Bank Name & Branch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="bank-name"
                                className="text-xs font-medium"
                            >
                                Bank Name
                            </Label>
                            <Input
                                id="bank-name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="e.g., State Bank of India"
                                maxLength={200}
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="bank-branch"
                                className="text-xs font-medium"
                            >
                                Branch Name
                            </Label>
                            <Input
                                id="bank-branch"
                                value={bankBranch}
                                onChange={(e) => setBankBranch(e.target.value)}
                                placeholder="e.g., Main Branch"
                                maxLength={200}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Account Number & IFSC Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="account-number"
                                className="text-xs font-medium"
                            >
                                Account Number
                            </Label>
                            <Input
                                id="account-number"
                                value={bankAccountNumber}
                                onChange={(e) =>
                                    setBankAccountNumber(e.target.value)
                                }
                                placeholder="e.g., 123456789012"
                                maxLength={50}
                                className="h-9 font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="ifsc-code"
                                className="text-xs font-medium"
                            >
                                IFSC Code
                            </Label>
                            <Input
                                id="ifsc-code"
                                value={bankIfsc}
                                onChange={(e) =>
                                    setBankIfsc(e.target.value.toUpperCase())
                                }
                                placeholder="e.g., SBIN0001234"
                                maxLength={50}
                                className="h-9 font-mono uppercase text-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                {isDirty && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={isSaving}
                        className="h-9 text-xs"
                    >
                        <RotateCcwIcon className="size-3.5 mr-1.5" />
                        Discard
                    </Button>
                )}

                <Button
                    type="submit"
                    size="sm"
                    disabled={isSaving || !isDirty}
                    className="h-9 px-5 text-xs font-medium cursor-pointer"
                >
                    {isSaving ? (
                        <>
                            <Loader2Icon className="size-3.5 mr-1.5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <SaveIcon className="size-3.5 mr-1.5" />
                            Save Settings
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
