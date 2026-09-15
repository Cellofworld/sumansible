import { Lesson } from '../data/lessons';

interface SidebarProps {
  lessons: Lesson[];
  currentLesson: number;
  completedLessons: number[];
  onSelect: (index: number) => void;
  isOpen: boolean;
}

export default function Sidebar({ lessons, currentLesson, completedLessons, onSelect, isOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-full w-72 bg-gray-800 border-r border-gray-700 z-40 transform transition-transform duration-300 lg:transform-none overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ top: '0' }}
    >
      <div className="p-4 border-b border-gray-700 lg:hidden">
        <h2 className="font-bold text-lg">Содержание</h2>
      </div>

      <nav className="p-3 space-y-1">
        {lessons.map((lesson, index) => {
          const isActive = index === currentLesson;
          const isCompleted = completedLessons.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(index)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-white'
                  : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-xl flex-shrink-0">{lesson.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium truncate">{lesson.title}</span>
                </div>
              </div>
              {isCompleted && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-4 border-t border-gray-700">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Совет дня 💡</p>
          <p className="text-xs text-gray-300">
            Практикуйте каждую команду на виртуальной машине или в Vagrant-окружении.
          </p>
        </div>
      </div>
    </aside>
  );
}
