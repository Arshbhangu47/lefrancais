export type VocabularyItem = {
  french: string;
  english: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Lesson = {
  slug: string;
  level: "A1" | "A2" | "B1";
  title: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  passage: string;
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    slug: "greetings",
    level: "A1",
    title: "Greetings and Introductions",
    description:
      "Learn how to greet someone, introduce yourself and ask simple personal questions.",
    estimatedMinutes: 10,
    objectives: [
      "Introduce yourself in French",
      "Ask someone their name",
      "Use common greetings correctly",
    ],
    passage: `
Bonjour ! Je m'appelle Pierre. J'ai vingt-six ans et j'habite à Montréal.

Aujourd'hui, je rencontre une nouvelle collègue au travail.

— Bonjour ! Comment vous appelez-vous ?
— Je m'appelle Sophie. Et vous ?
— Moi, c'est Pierre. Enchanté !
— Enchantée, Pierre. Vous habitez à Montréal ?
— Oui, j'habite près du centre-ville.

Sophie vient de France, mais elle travaille maintenant au Canada. Elle parle français et anglais. Pierre et Sophie prennent un café ensemble avant de commencer leur journée.
`,
    vocabulary: [
      { french: "Bonjour", english: "Hello / Good morning" },
      { french: "Je m'appelle", english: "My name is" },
      { french: "Comment vous appelez-vous ?", english: "What is your name?" },
      { french: "Enchanté / Enchantée", english: "Nice to meet you" },
      { french: "J'habite", english: "I live" },
      { french: "une collègue", english: "a female colleague" },
    ],
    quiz: [
      {
        question: "Where does Pierre live?",
        options: ["Paris", "Montréal", "Toronto", "London"],
        answer: "Montréal",
      },
      {
        question: "What does “Je m'appelle Sophie” mean?",
        options: [
          "I live with Sophie",
          "My name is Sophie",
          "I work with Sophie",
          "I am visiting Sophie",
        ],
        answer: "My name is Sophie",
      },
      {
        question: "Where is Sophie originally from?",
        options: ["Canada", "Belgium", "France", "Switzerland"],
        answer: "France",
      },
    ],
  },

  {
    slug: "family",
    level: "A1",
    title: "My Family",
    description:
      "Learn vocabulary for family members and understand a simple family description.",
    estimatedMinutes: 10,
    objectives: [
      "Name common family members",
      "Describe a small family",
      "Understand basic personal information",
    ],
    passage: `
Je m'appelle Amélie et j'habite à Québec avec ma famille.

Mon père s'appelle Marc. Il est professeur dans une école. Ma mère s'appelle Julie. Elle travaille dans un hôpital.

J'ai un frère et une sœur. Mon frère, Thomas, a dix-huit ans. Il aime le football et les jeux vidéo. Ma sœur, Emma, a douze ans. Elle aime lire et dessiner.

Nous avons aussi un petit chien qui s'appelle Max. Le dimanche, toute la famille mange ensemble chez mes grands-parents.
`,
    vocabulary: [
      { french: "la famille", english: "family" },
      { french: "le père", english: "father" },
      { french: "la mère", english: "mother" },
      { french: "le frère", english: "brother" },
      { french: "la sœur", english: "sister" },
      { french: "les grands-parents", english: "grandparents" },
    ],
    quiz: [
      {
        question: "What is Amélie's father's job?",
        options: ["Doctor", "Teacher", "Chef", "Driver"],
        answer: "Teacher",
      },
      {
        question: "How old is Thomas?",
        options: ["12", "16", "18", "20"],
        answer: "18",
      },
      {
        question: "What is the name of the family dog?",
        options: ["Marc", "Thomas", "Max", "Emma"],
        answer: "Max",
      },
    ],
  },

  {
    slug: "food",
    level: "A1",
    title: "At the Café",
    description:
      "Practise ordering food and drinks in a simple French café conversation.",
    estimatedMinutes: 12,
    objectives: [
      "Order food politely",
      "Recognize common café vocabulary",
      "Ask for the price",
    ],
    passage: `
Lucie entre dans un petit café près de son bureau.

— Bonjour madame. Qu'est-ce que vous désirez ?
— Bonjour. Je voudrais un café au lait et un croissant, s'il vous plaît.
— Vous désirez autre chose ?
— Oui, je voudrais aussi un jus d'orange.
— Très bien. C'est pour ici ou à emporter ?
— Pour ici, s'il vous plaît.

Le serveur prépare la commande.

— Voilà votre café, votre croissant et votre jus d'orange.
— Merci. Combien coûte la commande ?
— Cela coûte huit euros cinquante.
`,
    vocabulary: [
      { french: "Je voudrais", english: "I would like" },
      { french: "s'il vous plaît", english: "please" },
      { french: "un café au lait", english: "coffee with milk" },
      { french: "à emporter", english: "to take away" },
      { french: "pour ici", english: "for here" },
      { french: "Combien coûte... ?", english: "How much does ... cost?" },
    ],
    quiz: [
      {
        question: "What drink does Lucie order first?",
        options: ["Tea", "Coffee with milk", "Water", "Hot chocolate"],
        answer: "Coffee with milk",
      },
      {
        question: "Does Lucie take the order away?",
        options: ["Yes", "No", "The passage does not say", "Only the juice"],
        answer: "No",
      },
      {
        question: "How much does the order cost?",
        options: [
          "€6.50",
          "€7.50",
          "€8.50",
          "€10.00",
        ],
        answer: "€8.50",
      },
    ],
  },

  {
    slug: "shopping",
    level: "A2",
    title: "Shopping for Clothes",
    description:
      "Understand a conversation about clothing sizes, colours and prices.",
    estimatedMinutes: 15,
    objectives: [
      "Ask for a different size",
      "Discuss colours and prices",
      "Understand a shop conversation",
    ],
    passage: `
Nadia cherche une veste pour l'automne. Elle entre dans un magasin de vêtements.

Une vendeuse lui montre une veste noire, mais Nadia préfère une couleur plus claire. Elle essaie ensuite une veste beige en taille moyenne.

La veste est confortable, mais les manches sont un peu longues. La vendeuse apporte une taille plus petite. Cette fois, la veste lui va très bien.

Le prix normal est de quatre-vingts euros, mais le magasin offre une réduction de vingt pour cent. Nadia décide donc de l'acheter. Elle paie par carte et demande un reçu.
`,
    vocabulary: [
      { french: "une veste", english: "a jacket" },
      { french: "une vendeuse", english: "a saleswoman" },
      { french: "la taille", english: "size" },
      { french: "essayer", english: "to try on" },
      { french: "une réduction", english: "a discount" },
      { french: "un reçu", english: "a receipt" },
    ],
    quiz: [
      {
        question: "What colour does Nadia prefer?",
        options: ["A darker colour", "A lighter colour", "Red", "Blue"],
        answer: "A lighter colour",
      },
      {
        question: "What is wrong with the first beige jacket?",
        options: [
          "It is too expensive",
          "The sleeves are long",
          "It is too dark",
          "The zipper is broken",
        ],
        answer: "The sleeves are long",
      },
      {
        question: "Why does Nadia decide to buy the jacket?",
        options: [
          "It is free",
          "Her friend pays",
          "It fits well and has a discount",
          "It is the only jacket available",
        ],
        answer: "It fits well and has a discount",
      },
    ],
  },

  {
    slug: "travel",
    level: "A2",
    title: "A Train Journey",
    description:
      "Read about buying a ticket and travelling by train in France.",
    estimatedMinutes: 15,
    objectives: [
      "Understand travel schedules",
      "Recognize train-station vocabulary",
      "Follow a short travel story",
    ],
    passage: `
Julien doit voyager de Lyon à Paris pour une réunion. Il arrive à la gare à sept heures du matin.

Il achète un billet aller-retour à une borne automatique. Son train part à sept heures quarante-cinq depuis la voie numéro six.

Avant de monter dans le train, Julien achète une bouteille d'eau et un journal. Le voyage dure environ deux heures.

Pendant le trajet, il répond à quelques courriels et prépare ses notes pour la réunion. Le train arrive à Paris avec dix minutes de retard. Julien prend ensuite le métro pour aller à son bureau.
`,
    vocabulary: [
      { french: "la gare", english: "train station" },
      { french: "un billet aller-retour", english: "a return ticket" },
      { french: "la voie", english: "platform / track" },
      { french: "le trajet", english: "journey" },
      { french: "en retard", english: "late" },
      { french: "une réunion", english: "a meeting" },
    ],
    quiz: [
      {
        question: "Where is Julien travelling?",
        options: ["Lyon", "Marseille", "Paris", "Bordeaux"],
        answer: "Paris",
      },
      {
        question: "What time does the train leave?",
        options: ["7:00", "7:15", "7:30", "7:45"],
        answer: "7:45",
      },
      {
        question: "How late is the train?",
        options: ["5 minutes", "10 minutes", "20 minutes", "30 minutes"],
        answer: "10 minutes",
      },
    ],
  },

  {
    slug: "environment",
    level: "B1",
    title: "Protecting the Environment",
    description:
      "Explore practical environmental actions through an intermediate reading passage.",
    estimatedMinutes: 18,
    objectives: [
      "Understand an intermediate article",
      "Identify environmental actions",
      "Recognize cause-and-effect language",
    ],
    passage: `
Dans de nombreuses villes, les habitants essaient de changer leurs habitudes pour protéger l'environnement.

Certaines personnes utilisent davantage les transports en commun ou se déplacent à vélo. D'autres réduisent leur consommation de plastique en utilisant des sacs réutilisables et des bouteilles d'eau rechargeables.

Les municipalités jouent également un rôle important. Elles peuvent améliorer les réseaux de transport, créer davantage de pistes cyclables et faciliter le recyclage.

Cependant, les changements individuels ne sont pas toujours suffisants. Les entreprises doivent aussi réduire leurs déchets et utiliser des méthodes de production plus responsables.

Même si ces changements demandent du temps, chaque action peut contribuer à améliorer la qualité de l'air et à préserver les ressources naturelles.
`,
    vocabulary: [
      { french: "les habitudes", english: "habits" },
      { french: "les transports en commun", english: "public transportation" },
      { french: "réutilisable", english: "reusable" },
      { french: "les déchets", english: "waste" },
      { french: "préserver", english: "to preserve" },
      { french: "les ressources naturelles", english: "natural resources" },
    ],
    quiz: [
      {
        question: "Why do some people use bicycles?",
        options: [
          "To protect the environment",
          "Because cars are illegal",
          "To avoid exercising",
          "Because public transport is free",
        ],
        answer: "To protect the environment",
      },
      {
        question: "What can municipalities create?",
        options: [
          "More airports",
          "More shopping centres",
          "More bicycle paths",
          "More plastic products",
        ],
        answer: "More bicycle paths",
      },
      {
        question: "According to the passage, who must also reduce waste?",
        options: ["Only students", "Businesses", "Tourists", "Teachers"],
        answer: "Businesses",
      },
    ],
  },
];