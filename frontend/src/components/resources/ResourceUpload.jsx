import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function ResourceUpload({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation(async (payload) => {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to upload resource');
    return res.json();
  }, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['resources']);
      if (onSuccess) onSuccess(data);
      reset();
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input {...register('title')} placeholder="Title" required />
        <Select {...register('type')}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea {...register('description')} placeholder="Description" required />

      <div className="grid grid-cols-3 gap-4">
        <Input {...register('subject')} placeholder="Subject" required />
        <Input {...register('url')} placeholder="URL" required />
        <Input {...register('thumbnailUrl')} placeholder="Thumbnail URL" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input {...register('duration')} placeholder="Duration (minutes)" type="number" />
        <Select {...register('difficulty')}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input {...register('tags')} placeholder="Tags (comma separated)" />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </form>
  );
}
