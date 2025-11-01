import { DiscussionThread } from "../shared/DiscussionThread";

export default function DiscussionThreadExample() {
  return (
    <div className="p-8 bg-background max-w-3xl mx-auto space-y-4">
      <DiscussionThread
        title="How do I solve quadratic equations?"
        author="Sarah M."
        content="I'm having trouble understanding how to solve quadratic equations using the quadratic formula. Can someone explain the steps?"
        category="Mathematics"
        replies={8}
        likes={12}
        timestamp="3 hours ago"
      />
      <DiscussionThread
        title="Best study techniques for history exams?"
        author="Mike T."
        content="What are some effective methods for memorizing historical dates and events? I have a big test coming up next week."
        category="History"
        replies={15}
        likes={24}
        timestamp="1 day ago"
      />
    </div>
  );
}
