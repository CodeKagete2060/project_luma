import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
];

const types = [
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'interactive', label: 'Interactive' },
];

const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: '-createdAt', label: 'Latest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-averageRating', label: 'Highest Rated' },
  { value: '-likedBy', label: 'Most Liked' },
];

export function ResourceFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select
        value={filters.subject}
        onValueChange={(value) => onChange({ subject: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onChange({ type: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Resource Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.difficulty}
        onValueChange={(value) => onChange({ difficulty: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Difficulties</SelectItem>
          {difficulties.map((difficulty) => (
            <SelectItem key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(value) => onChange({ sort: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}