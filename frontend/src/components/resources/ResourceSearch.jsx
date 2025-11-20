import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export function ResourceSearch({ value, onChange }) {
  const debouncedChange = useDebouncedCallback((value) => {
    onChange(value);
  }, 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search resources..."
        className="pl-9"
        defaultValue={value}
        onChange={(e) => debouncedChange(e.target.value)}
      />
    </div>
  );
}