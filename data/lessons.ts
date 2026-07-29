export const lessons = [
  {
    slug: "greetings",
    level: "A1",
    title: "Greetings",

    passage: `
Bonjour !

Je m'appelle Pierre.

J'habite à Montréal.

J'aime le café et les croissants.

Aujourd'hui je rencontre un nouvel ami.
`,

    vocabulary: [
      {
        french: "Bonjour",
        english: "Hello",
      },
      {
        french: "J'habite",
        english: "I live",
      },
      {
        french: "Aujourd'hui",
        english: "Today",
      },
      {
        french: "ami",
        english: "friend",
      },
    ],

    quiz: [
      {
        question: "What does Bonjour mean?",
        options: [
          "Hello",
          "Goodbye",
          "Please",
          "Thanks",
        ],
        answer: "Hello",
      },
    ],
  },

  {
    slug: "family",
    level: "A1",
    title: "Family",

    passage: `
J'ai une petite famille.

Mon père travaille.

Ma mère cuisine.

J'ai une sœur.
`,

    vocabulary: [
      {
        french: "famille",
        english: "family",
      },
      {
        french: "père",
        english: "father",
      },
      {
        french: "mère",
        english: "mother",
      },
    ],

    quiz: [
      {
        question: "What does père mean?",
        options: [
          "Father",
          "Brother",
          "Friend",
          "Teacher",
        ],
        answer: "Father",
      },
    ],
  },
];