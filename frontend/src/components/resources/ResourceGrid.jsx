import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Video,
  FileText,
  GamepadIcon,
  Clock,
  Star,
  Heart,
  Eye
} from 'lucide-react';

const typeIcons = {
  video: Video,
  document: FileText,
  quiz: BookOpen,
  interactive: GamepadIcon,
};

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

function ResourceCard({ resource, isLoading }) {
  const navigate = useNavigate();
  const Icon = typeIcons[resource.type] || FileText;

  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full cursor-pointer overflow-hidden" onClick={() => navigate(\`/resources/${resource._id}\`)}>
        <div className="relative">
          {resource.thumbnailUrl ? (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-muted flex items-center justify-center">
              <Icon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${difficultyColors[resource.difficulty]}`}>
            {resource.difficulty}
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold truncate">{resource.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {resource.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{resource.duration}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{resource.averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {resource.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 2 && (
                <Badge variant="secondary">+{resource.tags.length - 2}</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{resource.likedBy.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{resource.views}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ResourceGrid({ resources, isLoading, pagination }) {
  const skeletons = Array(6).fill(0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? skeletons.map((_, i) => <ResourceCard key={i} isLoading={true} />)
          : resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => pagination.onPageChange(i + 1)}
                  isActive={pagination.currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}