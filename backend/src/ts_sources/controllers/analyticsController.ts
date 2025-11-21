import { Router } from 'express';
import { checkAuth } from '../middlewares/auth';
import User from '../models/User';
import Activity from '../models/Activity';
import Assignment from '../models/Assignment';

export const analyticsController = Router();

analyticsController.get('/:userId', checkAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's recent activities
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    // Get user's assignments
    const assignments = await Assignment.find({ userId })
      .sort({ dueDate: -1 })
      .limit(10);

    // Calculate performance metrics
    const performance = calculatePerformance(assignments);

    // Calculate activity breakdown
    const activity = calculateActivityBreakdown(activities);

    // Calculate subject progress
    const subjectBreakdown = calculateSubjectProgress(assignments);

    // Calculate streak data
    const streak = calculateStreak(activities);

    // Calculate AI usage stats
    const aiStats = calculateAIStats(activities);

    // Calculate recent assignments stats
    const recentAssignments = calculateAssignmentStats(assignments);

    res.json({
      performance,
      activity,
      subjectBreakdown,
      streak,
      aiStats,
      recentAssignments,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Helper functions for calculations
function calculatePerformance(assignments) {
  const scores = assignments.map(a => a.score).filter(Boolean);
  const average = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const trend = assignments
    .filter(a => a.score)
    .slice(0, 7)
    .map(a => ({
      date: a.submittedAt.toLocaleDateString(),
      score: a.score,
    }))
    .reverse();

  const achievements = assignments
    .filter(a => a.score >= 90)
    .slice(0, 3)
    .map(a => ({
      title: 'Excellence in ' + a.subject,
      description: `Scored ${a.score}% on ${a.title}`,
      date: a.submittedAt.toLocaleDateString(),
    }));

  return { average, trend, achievements };
}

function calculateActivityBreakdown(activities) {
  const totalHours = activities.reduce((total, activity) => {
    return total + (activity.duration || 0) / 60; // Convert minutes to hours
  }, 0);

  const breakdown = activities.reduce((acc, activity) => {
    const hour = Math.round((activity.duration || 0) / 60 * 10) / 10;
    const existing = acc.find(a => a.activity === activity.type);
    
    if (existing) {
      existing.hours += hour;
    } else {
      acc.push({ activity: activity.type, hours: hour });
    }
    return acc;
  }, []);

  const trend = {
    direction: totalHours > 0 ? 'up' : 'down',
    value: `${Math.abs(Math.round(totalHours))}h this week`,
  };

  return { totalHours: Math.round(totalHours), breakdown, trend };
}

function calculateSubjectProgress(assignments) {
  const subjects = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.subject]) {
      acc[assignment.subject] = {
        total: 0,
        completed: 0,
      };
    }
    acc[assignment.subject].total++;
    if (assignment.status === 'completed') {
      acc[assignment.subject].completed++;
    }
    return acc;
  }, {});

  return {
    subjects: Object.entries(subjects).map(([name, data]) => ({
      name,
      progress: Math.round((data.completed / data.total) * 100),
    })),
  };
}

function calculateStreak(activities) {
  let currentStreak = 0;
  let lastActivityDate = null;

  // Sort activities by date
  const sortedActivities = [...activities].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Calculate current streak
  for (let i = 0; i < sortedActivities.length; i++) {
    const activityDate = sortedActivities[i].createdAt.toDateString();
    
    if (!lastActivityDate) {
      lastActivityDate = activityDate;
      currentStreak = 1;
      continue;
    }

    const dayDiff = Math.round(
      (new Date(lastActivityDate) - new Date(activityDate)) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      currentStreak++;
      lastActivityDate = activityDate;
    } else {
      break;
    }
  }

  return {
    days: currentStreak,
    trend: {
      direction: currentStreak > 0 ? 'up' : 'down',
      value: `${currentStreak} day streak`,
    },
  };
}

function calculateAIStats(activities) {
  const aiActivities = activities.filter(a => a.type === 'ai_assistance');
  const totalSessions = aiActivities.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      usageChange: '0%',
      topSubject: 'N/A',
      averageRating: 'N/A',
      improvementRate: '0%',
    };
  }

  // Calculate top subject
  const subjectCount = aiActivities.reduce((acc, activity) => {
    acc[activity.subject] = (acc[activity.subject] || 0) + 1;
    return acc;
  }, {});
  const topSubject = Object.entries(subjectCount)
    .sort(([,a], [,b]) => b - a)[0][0];

  // Calculate average rating
  const ratings = aiActivities
    .map(a => a.rating)
    .filter(Boolean);
  const averageRating = ratings.length
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10
    : 'N/A';

  // Calculate usage change
  const previousPeriodCount = aiActivities
    .filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return a.createdAt > weekAgo;
    }).length;
  const usageChange = previousPeriodCount
    ? `${Math.round((totalSessions / previousPeriodCount - 1) * 100)}%`
    : '0%';

  return {
    totalSessions,
    usageChange,
    topSubject,
    averageRating,
    improvementRate: '15%', // This would need actual performance data to calculate
  };
}

function calculateAssignmentStats(assignments) {
  const completed = assignments.filter(a => a.status === 'completed').length;
  const total = assignments.length;

  const previousCompleted = assignments
    .filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return (
        a.status === 'completed' &&
        a.submittedAt > weekAgo
      );
    }).length;

  const trend = {
    direction: completed >= previousCompleted ? 'up' : 'down',
    value: `${Math.abs(completed - previousCompleted)} vs last week`,
  };

  return { completed, total, trend };
}
