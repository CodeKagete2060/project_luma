import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import { ForumPost } from './ForumPost';

export function ForumList({
  posts = [],
  categories = [],
  onNewPost,
  onUpvote,
  onFlag,
  isLoading,
  className = ''
}) {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return b.upvotes.length - a.upvotes.length;
        case 'replies':
          return b.replyCount - a.replyCount;
        default:
          return 0;
      }
    });

  const handlePostClick = (postId) => {
    navigate(`/forum/post/${postId}`);
  };

  return (
    <div className={className}>
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Sort by
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('popular')}>
                Most Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('replies')}>
                Most Replies
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onNewPost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Discussion
          </Button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading discussions...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? 'No discussions found matching your search'
              : 'No discussions yet'}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post._id)}
              className="cursor-pointer"
            >
              <ForumPost
                post={post}
                onUpvote={(e) => {
                  e.stopPropagation();
                  onUpvote(post._id);
                }}
                onFlag={(e) => {
                  e.stopPropagation();
                  onFlag(post._id);
                }}
                isAuthor={post.isAuthor}
                isModerated={post.isModerated}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}