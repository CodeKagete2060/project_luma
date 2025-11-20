import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResourceCard } from '../components/shared/ResourceCard';

describe('ResourceCard', () => {
  const mockResource = {
    _id: '1',
    title: 'Test Resource',
    description: 'Test Description',
    subject: 'Math',
    type: 'Video',
    difficulty: 'intermediate',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    duration: 60,
    views: 100,
    ratings: [
      { rating: 4 },
      { rating: 5 }
    ],
    likedBy: ['user1', 'user2'],
    createdBy: {
      firstName: 'John',
      lastName: 'Doe'
    }
  };

  it('renders resource card with correct information', () => {
    render(<ResourceCard resource={mockResource} />);
    
    expect(screen.getByText('Test Resource')).toBeDefined();
    expect(screen.getByText('Test Description')).toBeDefined();
    expect(screen.getByText('Math')).toBeDefined();
    expect(screen.getByText('Video')).toBeDefined();
    expect(screen.getByText('Intermediate')).toBeDefined();
    expect(screen.getByText('60 min')).toBeDefined();
    expect(screen.getByText('100 views')).toBeDefined();
    expect(screen.getByText('4.5')).toBeDefined(); // Average rating
    expect(screen.getByText('2 likes')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalResource = {
      _id: '1',
      title: 'Test Resource',
      description: 'Test Description',
      subject: 'Math',
      type: 'Video',
      difficulty: 'intermediate',
      ratings: [],
      likedBy: [],
      createdBy: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };

    render(<ResourceCard resource={minimalResource} />);
    
    expect(screen.getByText('Test Resource')).toBeDefined();
    expect(screen.getByText('0')).toBeDefined(); // Rating when no ratings
    expect(screen.getByText('0 likes')).toBeDefined();
  });
});