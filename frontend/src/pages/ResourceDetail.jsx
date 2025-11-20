import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResource } from '@/hooks/useResource';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Heart, Eye, Clock } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const {
    resource,
    isLoading,
    toggleLike,
    toggleLikeStatus,
    addRating,
    addRatingStatus,
    incrementView,
  } = useResource(id);

  const [rating, setRating] = React.useState(5);
  const [review, setReview] = React.useState('');

  React.useEffect(() => {
    if (id) incrementView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !resource) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const handleToggleLike = () => {
    toggleLike();
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    addRating({ rating: Number(rating), review });
    setReview('');
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{resource.subject} • {resource.type}</p>
              </CardHeader>
              <CardContent>
                {resource.thumbnailUrl ? (
                  <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-80 object-cover rounded-md mb-4" />
                ) : (
                  <div className="w-full h-80 bg-muted rounded-md mb-4 flex items-center justify-center">
                    <Star className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}

                <div className="prose max-w-none mb-4">
                  <p>{resource.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>{resource.likedBy.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{resource.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{resource.duration}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About this resource</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Difficulty</span>
                    <Badge>{resource.difficulty}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tags</span>
                    <div className="flex gap-2">
                      {resource.tags.map((t, i) => (
                        <Badge key={i} variant="secondary">{t}</Badge>
                      ))}
                    </div>
                  </div>

                  {resource.prerequisites?.length > 0 && (
                    <div>
                      <h4 className="font-medium">Prerequisites</h4>
                      <ul className="list-disc pl-5">
                        {resource.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ratings & Reviews</CardTitle>
                <p className="text-sm text-muted-foreground">Average: {resource.averageRating ? resource.averageRating.toFixed(1) : 'N/A'}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(resource.ratings || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet — be the first to review.</p>
                  ) : (
                    (resource.ratings || []).map((r, idx) => (
                      <div key={idx} className="border rounded-md p-3 bg-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.user?.firstName} {r.user?.lastName}</div>
                            <div className="text-sm text-muted-foreground">{r.rating} / 5</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        {r.review && <p className="mt-2">{r.review}</p>}
                      </div>
                    ))
                  )}

                  <form onSubmit={handleSubmitRating} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Your rating</label>
                      <select value={rating} onChange={(e) => setRating(e.target.value)} className="ml-2">
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                      </select>
                    </div>
                    <Textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Write a short review (optional)" />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={addRatingStatus.isLoading}>{addRatingStatus.isLoading ? 'Saving...' : 'Submit Review'}</Button>
                      <Button variant="secondary" onClick={() => { setRating(5); setReview(''); }}>Reset</Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleToggleLike} disabled={toggleLikeStatus.isLoading}>
                  {toggleLikeStatus.isLoading ? '...' : 'Toggle Like'}
                </Button>

                <a href={resource.url} target="_blank" rel="noreferrer">
                  <Button asChild>
                    <span>Open Resource</span>
                  </Button>
                </a>

                <div className="text-sm text-muted-foreground">
                  Created by {resource.createdBy?.firstName} {resource.createdBy?.lastName}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {resource.learningOutcomes?.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
