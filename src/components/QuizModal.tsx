interface QuizModalProps {
  quiz: {
    question: string;
    options: string[];
    correct: number;
  };
  onAnswer: (correct: boolean) => void;
  result: boolean | null;
  onClose: () => void;
}

export default function QuizModal({ quiz, onAnswer, result, onClose }: QuizModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🧠 Проверка знаний
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <p className="text-lg text-gray-200 mb-6">{quiz.question}</p>

          <div className="space-y-3">
            {quiz.options.map((option, idx) => {
              let buttonClass = 'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ';

              if (result !== null) {
                if (idx === quiz.correct) {
                  buttonClass += 'bg-green-500/20 border-green-500 text-green-300';
                } else if (result === false) {
                  buttonClass += 'bg-gray-700/50 border-gray-600 text-gray-500';
                } else {
                  buttonClass += 'bg-gray-700/50 border-gray-600 text-gray-400';
                }
              } else {
                buttonClass += 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 cursor-pointer';
              }

              return (
                <button
                  key={idx}
                  onClick={() => result === null && onAnswer(idx === quiz.correct)}
                  disabled={result !== null}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                    {result !== null && idx === quiz.correct && (
                      <svg className="w-5 h-5 text-green-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result feedback */}
          {result !== null && (
            <div className={`mt-6 p-4 rounded-xl text-center ${
              result ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {result ? (
                <p className="text-green-300 font-medium">✅ Правильно! Отличная работа!</p>
              ) : (
                <p className="text-red-300 font-medium">❌ Неправильно. Попробуйте ещё раз!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
