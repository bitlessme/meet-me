import { useState } from 'react';
import { ClipboardList, ArrowRight } from 'lucide-react';
import { QuestionnaireAnswers } from '../types';
import { storage } from '../storage';

interface QuestionnaireProps {
  profileId: string;
  onComplete: () => void;
}

const QUESTIONS = [
  {
    id: 'q1',
    question: 'What are you looking for in a match?',
    type: 'textarea' as const
  },
  {
    id: 'q2',
    question: 'What do you do for fun?',
    type: 'textarea' as const
  },
  {
    id: 'q3',
    question: 'Describe your ideal weekend',
    type: 'textarea' as const
  },
  {
    id: 'q4',
    question: 'What are your top 3 values?',
    type: 'text' as const
  },
  {
    id: 'q5',
    question: 'Where do you see yourself in 5 years?',
    type: 'textarea' as const
  }
];

export default function Questionnaire({ profileId, onComplete }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentQ = QUESTIONS[currentQuestion];
    if (!answers[currentQ.id]?.trim()) {
      alert('Please answer the question before continuing');
      return;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const questionnaireData: QuestionnaireAnswers = {
      profileId,
      answers,
      completedAt: new Date().toISOString()
    };

    storage.updateProfile(profileId, { questionnaire: questionnaireData });
    onComplete();
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <ClipboardList className="w-8 h-8 text-amber-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Questions</h1>
            <p className="text-gray-600">Help us understand you better</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <label className="block text-xl font-semibold text-gray-900 mb-4">
              {question.question}
            </label>

            {question.type === 'textarea' ? (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all resize-none"
                rows={5}
                placeholder="Type your answer here..."
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                placeholder="Type your answer here..."
                autoFocus
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
            >
              {currentQuestion < QUESTIONS.length - 1 ? (
                <>
                  Next <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                'Complete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
