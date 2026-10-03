'use client';

import { SearchIcon } from 'lucide-react';
import { Field, FieldLabel } from './field';
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.delete('page');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 400);

    return (
        <Field className="max-w-sm">
            <FieldLabel htmlFor="search" className="sr-only">
                Search
            </FieldLabel>
            <InputGroup>
                <InputGroupInput
                    placeholder={placeholder}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
        </Field>
    );
}
