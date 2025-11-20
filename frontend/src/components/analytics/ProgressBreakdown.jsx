import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function ProgressBreakdown({ data, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.value}%</span>
            </div>
            <Progress
              value={item.value}
              className={
                item.value >= 80 ? 'bg-success/20' :
                item.value >= 60 ? 'bg-warning/20' :
                'bg-destructive/20'
              }
              indicatorClassName={
                item.value >= 80 ? 'bg-success' :
                item.value >= 60 ? 'bg-warning' :
                'bg-destructive'
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}