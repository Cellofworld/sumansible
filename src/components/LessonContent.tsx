import { Lesson } from '../data/lessons';
import CodeBlock from './CodeBlock';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

export default function LessonContent({ lesson, isCompleted, onMarkComplete }: LessonContentProps) {
  return (
    <article className="space-y-8">
      {/* Lesson header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{lesson.icon}</span>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">{lesson.title}</h2>
              <p className="text-sm text-gray-400 mt-1">Урок {lesson.id} из 12</p>
            </div>
          </div>
        </div>
        {isCompleted && (
          <span className="flex-shrink-0 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
            ✓ Пройден
          </span>
        )}
      </div>

      {/* Theory section */}
      <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            📖
          </span>
          Теория
        </h3>
        <div className="space-y-3">
          {lesson.theory.map((paragraph, idx) => (
            <p key={idx} className="text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Code examples */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
            💻
          </span>
          Практика
        </h3>
        {lesson.code.map((codeBlock, idx) => (
          <CodeBlock
            key={idx}
            title={codeBlock.title}
            language={codeBlock.language}
            code={codeBlock.code}
          />
        ))}
      </section>

      {/* Tips */}
      {lesson.tips.length > 0 && (
        <section className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-2xl p-6 border border-amber-700/30">
          <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
            💡 Советы
          </h3>
          <ul className="space-y-2">
            {lesson.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-amber-100/80">
                <span className="text-amber-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mark complete button */}
      {!isCompleted && (
        <div className="text-center pt-4">
          <button
            onClick={onMarkComplete}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-green-500/20"
          >
            ✓ Отметить урок пройденным
          </button>
        </div>
      )}
    </article>
  );
}
