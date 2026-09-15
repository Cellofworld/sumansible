import { useState, useEffect } from 'react';
import { lessons } from './data/lessons';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import QuizModal from './components/QuizModal';
import ProgressBar from './components/ProgressBar';

function App() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem('ansible-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  useEffect(() => {
    localStorage.setItem('ansible-completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const markComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleQuizAnswer = (correct: boolean) => {
    setQuizResult(correct);
    if (correct) {
      markComplete(lessons[currentLesson].id);
    }
    setTimeout(() => {
      setShowQuiz(false);
      setQuizResult(null);
    }, 2000);
  };

  const goToLesson = (index: number) => {
    setCurrentLesson(index);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    if (currentLesson < lessons.length - 1) {
      goToLesson(currentLesson + 1);
    }
  };

  const goPrev = () => {
    if (currentLesson > 0) {
      goToLesson(currentLesson - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📘</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Ansible Самоучитель
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Прогресс: {completedLessons.length}/{lessons.length}
            </span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <ProgressBar current={completedLessons.length} total={lessons.length} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          lessons={lessons}
          currentLesson={currentLesson}
          completedLessons={completedLessons}
          onSelect={goToLesson}
          isOpen={sidebarOpen}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
            <LessonContent
              lesson={lessons[currentLesson]}
              isCompleted={completedLessons.includes(lessons[currentLesson].id)}
              onMarkComplete={() => markComplete(lessons[currentLesson].id)}
            />

            {/* Quiz button */}
            {lessons[currentLesson].quiz && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
                >
                  🧠 Проверить знания
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex justify-between items-center border-t border-gray-700 pt-6">
              <button
                onClick={goPrev}
                disabled={currentLesson === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </button>

              <span className="text-sm text-gray-500">
                {currentLesson + 1} / {lessons.length}
              </span>

              <button
                onClick={goNext}
                disabled={currentLesson === lessons.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Далее</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Quiz Modal */}
      {showQuiz && lessons[currentLesson].quiz && (
        <QuizModal
          quiz={lessons[currentLesson].quiz!}
          onAnswer={handleQuizAnswer}
          result={quizResult}
          onClose={() => { setShowQuiz(false); setQuizResult(null); }}
        />
      )}
    </div>
  );
}

export default App;
