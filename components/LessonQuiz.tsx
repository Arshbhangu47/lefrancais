"use client";

import { useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type LessonQuizProps = {
  questions: QuizQuestion[];
};

export default function LessonQuiz({ questions }: LessonQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, question, index) => {
    return selectedAnswers[index] === question.answer ? total + 1 : total;
  }, 0);

  function selectAnswer(questionIndex: number, option: string) {
    if (submitted) return;

    setSelectedAnswers((current) => ({
      ...current,
      [questionIndex]: option,
    }));
  }

  function resetQuiz() {
    setSelectedAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold">Quiz</h2>

      <div className="mt-8 space-y-10">
        {questions.map((question, questionIndex) => (
          <div key={question.question}>
            <h3 className="text-xl font-semibold">
              {questionIndex + 1}. {question.question}
            </h3>

            <div className="mt-5 space-y-3">
              {question.options.map((option) => {
                const isSelected =
                  selectedAnswers[questionIndex] === option;

                const isCorrect = option === question.answer;

                let buttonStyle =
                  "border-gray-300 hover:border-blue-500 hover:bg-blue-50";

                if (isSelected) {
                  buttonStyle = "border-blue-600 bg-blue-50";
                }

                if (submitted && isCorrect) {
                  buttonStyle = "border-green-600 bg-green-50 text-green-800";
                }

                if (submitted && isSelected && !isCorrect) {
                  buttonStyle = "border-red-600 bg-red-50 text-red-800";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      selectAnswer(questionIndex, option)
                    }
                    className={`block w-full rounded-xl border-2 px-5 py-4 text-left transition ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <p className="mt-4 font-medium">
                {selectedAnswers[questionIndex] === question.answer
                  ? "Correct!"
                  : `Correct answer: ${question.answer}`}
              </p>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={
            Object.keys(selectedAnswers).length !== questions.length
          }
          onClick={() => setSubmitted(true)}
          className="mt-10 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Check Answers
        </button>
      ) : (
        <div className="mt-10 rounded-xl bg-gray-50 p-6">
          <p className="text-2xl font-bold">
            Score: {score}/{questions.length}
          </p>

          <button
            type="button"
            onClick={resetQuiz}
            className="mt-5 rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:bg-white"
          >
            Try Again
          </button>
        </div>
      )}
    </section>
  );
}