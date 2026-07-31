"use client";

import { useState } from "react";

export type VocabularyEditorItem = {
  french: string;
  english: string;
};

export type QuizEditorItem = {
  question: string;
  correctAnswer: string;
  explanation: string;
  options: string[];
};

type LessonContentEditorProps = {
  initialVocabulary: VocabularyEditorItem[];
  initialQuiz: QuizEditorItem[];
};

function createEmptyVocabulary(): VocabularyEditorItem {
  return {
    french: "",
    english: "",
  };
}

function createEmptyQuestion(): QuizEditorItem {
  return {
    question: "",
    correctAnswer: "",
    explanation: "",
    options: ["", "", "", ""],
  };
}

export default function LessonContentEditor({
  initialVocabulary,
  initialQuiz,
}: LessonContentEditorProps) {
  const [vocabulary, setVocabulary] = useState<
    VocabularyEditorItem[]
  >(
    initialVocabulary.length > 0
      ? initialVocabulary
      : [createEmptyVocabulary()]
  );

  const [quiz, setQuiz] = useState<QuizEditorItem[]>(
    initialQuiz.length > 0
      ? initialQuiz
      : [createEmptyQuestion()]
  );

  function updateVocabulary(
    index: number,
    field: keyof VocabularyEditorItem,
    value: string
  ) {
    setVocabulary((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addVocabulary() {
    setVocabulary((current) => [
      ...current,
      createEmptyVocabulary(),
    ]);
  }

  function removeVocabulary(index: number) {
    setVocabulary((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateQuestion(
    index: number,
    field: "question" | "correctAnswer" | "explanation",
    value: string
  ) {
    setQuiz((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string
  ) {
    setQuiz((current) =>
      current.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
  }

  function addOption(questionIndex: number) {
    setQuiz((current) =>
      current.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? {
              ...question,
              options: [...question.options, ""],
            }
          : question
      )
    );
  }

  function removeOption(
    questionIndex: number,
    optionIndex: number
  ) {
    setQuiz((current) =>
      current.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        return {
          ...question,
          options: question.options.filter(
            (_, currentOptionIndex) =>
              currentOptionIndex !== optionIndex
          ),
        };
      })
    );
  }

  function addQuestion() {
    setQuiz((current) => [
      ...current,
      createEmptyQuestion(),
    ]);
  }

  function removeQuestion(index: number) {
    setQuiz((current) =>
      current.filter(
        (_, questionIndex) => questionIndex !== index
      )
    );
  }

  return (
    <>
      <input
        type="hidden"
        name="vocabularyJson"
        value={JSON.stringify(vocabulary)}
        readOnly
      />

      <input
        type="hidden"
        name="quizJson"
        value={JSON.stringify(quiz)}
        readOnly
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Vocabulary
            </h2>

            <p className="mt-2 text-slate-600">
              Add important French words and their English
              meanings.
            </p>
          </div>

          <button
            type="button"
            onClick={addVocabulary}
            className="rounded-xl border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add Word
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {vocabulary.map((word, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  French
                </label>

                <input
                  value={word.french}
                  onChange={(event) =>
                    updateVocabulary(
                      index,
                      "french",
                      event.target.value
                    )
                  }
                  placeholder="Bonjour"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  English
                </label>

                <input
                  value={word.english}
                  onChange={(event) =>
                    updateVocabulary(
                      index,
                      "english",
                      event.target.value
                    )
                  }
                  placeholder="Hello"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVocabulary(index)}
                className="self-end rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Quiz Questions
            </h2>

            <p className="mt-2 text-slate-600">
              Add comprehension questions, answers and
              explanations.
            </p>
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="rounded-xl border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            + Add Question
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {quiz.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-950">
                  Question {questionIndex + 1}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    removeQuestion(questionIndex)
                  }
                  className="font-semibold text-red-700 hover:text-red-900"
                >
                  Remove
                </button>
              </div>

              <div className="mt-6">
                <label className="block font-semibold text-slate-800">
                  Question
                </label>

                <textarea
                  value={question.question}
                  onChange={(event) =>
                    updateQuestion(
                      questionIndex,
                      "question",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Where does Pierre live?"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {question.options.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex gap-2"
                    >
                      <input
                        value={option}
                        onChange={(event) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            event.target.value
                          )
                        }
                        placeholder={`Option ${
                          optionIndex + 1
                        }`}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                      />

                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeOption(
                              questionIndex,
                              optionIndex
                            )
                          }
                          aria-label="Remove option"
                          className="rounded-xl border border-red-200 px-3 text-red-700 hover:bg-red-50"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => addOption(questionIndex)}
                className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                + Add another option
              </button>

              <div className="mt-6">
                <label className="block font-semibold text-slate-800">
                  Correct answer
                </label>

                <input
                  value={question.correctAnswer}
                  onChange={(event) =>
                    updateQuestion(
                      questionIndex,
                      "correctAnswer",
                      event.target.value
                    )
                  }
                  placeholder="Montréal"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                />

                <p className="mt-2 text-sm text-slate-500">
                  This must exactly match one of the options.
                </p>
              </div>

              <div className="mt-6">
                <label className="block font-semibold text-slate-800">
                  Explanation
                </label>

                <textarea
                  value={question.explanation}
                  onChange={(event) =>
                    updateQuestion(
                      questionIndex,
                      "explanation",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Pierre says that he lives in Montréal."
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}