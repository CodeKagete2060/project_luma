import { ResourceCard } from "../shared/ResourceCard";

export default function ResourceCardExample() {
  return (
    <div className="p-8 bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ResourceCard
        title="Introduction to Algebra"
        category="Mathematics"
        description="A comprehensive guide covering basic algebraic concepts, equations, and problem-solving techniques."
        uploadedBy="Mr. Smith"
        uploadDate="Jan 15, 2024"
        fileType="PDF"
      />
      <ResourceCard
        title="World History Timeline"
        category="History"
        description="Interactive timeline covering major historical events from ancient civilizations to modern times."
        uploadedBy="Ms. Johnson"
        uploadDate="Jan 18, 2024"
        fileType="PDF"
      />
      <ResourceCard
        title="Science Lab Safety"
        category="Science"
        description="Essential safety guidelines and procedures for conducting experiments in the science laboratory."
        uploadedBy="Dr. Chen"
        uploadDate="Jan 20, 2024"
        fileType="PDF"
      />
    </div>
  );
}
