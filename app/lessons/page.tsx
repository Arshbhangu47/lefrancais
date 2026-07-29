import LessonCard from "../../components/LessonCard";

const lessons = [
  {
    title: "Greetings",
    level: "A1",
    slug: "greetings",
    description: "Learn common greetings and introductions.",
  },
  {
    title: "Family",
    level: "A1",
    slug: "family",
    description: "Talk about your family members.",
  },
  {
    title: "Food",
    level: "A1",
    slug: "food",
    description: "Vocabulary for food and restaurants.",
  },
  {
    title: "Shopping",
    level: "A2",
    slug: "shopping",
    description: "Learn shopping conversations.",
  },
  {
    title: "Travel",
    level: "A2",
    slug: "travel",
    description: "Travel vocabulary and reading.",
  },
  {
    title: "Environment",
    level: "B1",
    slug: "environment",
    description: "Read about climate and nature.",
  },
];

export default function LessonsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="text-5xl font-bold">
        Reading Lessons
      </h1>

      <p className="mt-4 text-gray-600">
        Choose a lesson to begin learning French.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.slug}
            {...lesson}
          />
        ))}

      </div>

    </div>
  );
}