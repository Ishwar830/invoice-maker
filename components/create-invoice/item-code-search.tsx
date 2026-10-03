'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { QrCodeIcon, CheckCircle2Icon, SearchIcon, Loader2Icon } from 'lucide-react';
import { searchInventoryItemsAction } from '@/app/actions/inventory-search';
import type { InvoiceFormItem, InventorySearchResult } from '@/lib/types';
import { useInvoice } from './invoice-context';
import { FormField } from './form-field';
import clsx from 'clsx';

interface ItemCodeSearchProps {
    item: InvoiceFormItem;
}

export function ItemCodeSearch({ item }: ItemCodeSearchProps) {
    const {
        actions: { fillItemFromInventory },
    } = useInvoice();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<InventorySearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [debouncedQuery] = useDebounce(query, 300);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isLinked = Boolean(item.inventoryItemId);

    // Search on debounced query change
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.trim().length === 0) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        searchInventoryItemsAction(debouncedQuery).then((data) => {
            if (!cancelled) {
                setResults(data);
                setIsOpen(data.length > 0);
                setActiveIndex(-1);
                setIsLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = useCallback(
        (result: InventorySearchResult) => {
            fillItemFromInventory(item.id, result);
            setQuery(result.itemCode);
            setIsOpen(false);
            setResults([]);
        },
        [fillItemFromInventory, item.id]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                handleSelect(results[activeIndex]);
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        },
        [isOpen, results, activeIndex, handleSelect]
    );

    const metalTypeLabel: Record<string, string> = {
        gold: 'Gold',
        silver: 'Silver',
        platinum: 'Platinum',
        diamond: 'Diamond',
        other: 'Other',
    };

    return (
        <div ref={containerRef} className="relative sm:col-span-2">
            <FormField
                label="Item Code"
                icon={
                    isLinked ? (
                        <CheckCircle2Icon className="size-3 text-emerald-500" />
                    ) : isLoading ? (
                        <Loader2Icon className="size-3 text-muted-foreground/50 animate-spin" />
                    ) : (
                        <QrCodeIcon className="size-3 text-muted-foreground/50" />
                    )
                }
            >
                <div className="relative">
                    <Input
                        ref={inputRef}
                        id={`item-code-${item.id}`}
                        placeholder="e.g. KJ-AB12"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            // Clear link if user changes the code after selecting
                            if (isLinked && e.target.value !== item.inventoryItemId) {
                                // don't clear inventoryItemId here — only on new selection
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (results.length > 0) setIsOpen(true);
                        }}
                        autoComplete="off"
                        className={clsx(
                            'text-sm pr-7',
                            isLinked && 'border-emerald-400/60 bg-emerald-50/30 focus-visible:ring-emerald-400/40'
                        )}
                    />
                    {!isLinked && !isLoading && (
                        <SearchIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                    )}
                </div>
            </FormField>

            {/* Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                    <ul role="listbox" className="py-1">
                        {results.map((result, idx) => (
                            <li
                                key={result.id}
                                role="option"
                                aria-selected={idx === activeIndex}
                                onMouseDown={(e) => {
                                    // prevent blur before click registers
                                    e.preventDefault();
                                    handleSelect(result);
                                }}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={clsx(
                                    'flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors',
                                    idx === activeIndex
                                        ? 'bg-[#D4AF37]/10 text-[#1A1A1A]'
                                        : 'text-foreground hover:bg-muted/50'
                                )}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="shrink-0 font-mono text-xs font-semibold text-[#96791B] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
                                        {result.itemCode}
                                    </span>
                                    <span className="truncate text-muted-foreground text-xs">
                                        {result.categoryName}
                                    </span>
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                                    <span className="capitalize">
                                        {metalTypeLabel[result.metalType] ?? result.metalType}
                                    </span>
                                    {result.metalPurity && (
                                        <>
                                            <span className="text-border">·</span>
                                            <span>{result.metalPurity}</span>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-border/50 px-3 py-1.5">
                        <p className="text-[11px] text-muted-foreground/60">
                            {results.length} result{results.length !== 1 ? 's' : ''} · only available items shown
                        </p>
                    </div>
                </div>
            )}

            {/* No results state */}
            {isOpen && results.length === 0 && !isLoading && debouncedQuery && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-border bg-popover px-3 py-3 shadow-lg">
                    <p className="text-xs text-muted-foreground">No available items match &ldquo;{debouncedQuery}&rdquo;</p>
                </div>
            )}
        </div>
    );
}
