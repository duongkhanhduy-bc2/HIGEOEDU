import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, KnowledgeIsland, TimelineMilestone, MascotMood } from '../types/index.ts';
import { Mascot } from './Mascot.tsx';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  Check,
} from 'lucide-react';

interface QuizModalProps {
  island?: KnowledgeIsland | null;
  milestone?: TimelineMilestone | null;
  customQuestions?: Question[] | null;
  onClose: () => void;
  onRewardXP: (xp: number, isCompleted: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  island,
  milestone,
  customQuestions,
  onClose,
  onRewardXP,
}) => {
  const questions: Question[] =
    customQuestions || island?.questions || milestone?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');

  // Status for current question: 'idle' | 'submitted'
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Score tracking
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQ = questions[currentIndex];

  // Mascot mood
  const getMascotMood = (): MascotMood => {
    if (isQuizComplete) return 'celebrate';
    if (isSubmitted) {
      return isCorrect ? 'correct' : showHint ? 'hint' : 'wrong';
    }
    return showHint ? 'hint' : 'welcome';
  };

  const handleCheckAnswer = () => {
    if (!currentQ) return;

    let userAns = '';
    if (currentQ.type === 'multiple_choice' || currentQ.type === 'true_false') {
      userAns = selectedOption.trim();
    } else {
      userAns = textAnswer.trim();
    }

    if (!userAns) return;

    const correctAns = currentQ.correctAnswer;
    let match = false;

    if (Array.isArray(correctAns)) {
      match = correctAns.some(
        (ans) => ans.toLowerCase().trim() === userAns.toLowerCase().trim()
      );
    } else {
      match =
        correctAns.toLowerCase().trim() === userAns.toLowerCase().trim() ||
        userAns.toLowerCase().includes(correctAns.toLowerCase().trim());
    }

    setIsSubmitted(true);
    setIsCorrect(match);

    if (match) {
      const xpGain = currentQ.xp || 40;
      setScore((prev) => prev + 1);
      setEarnedXP((prev) => prev + xpGain);
      setShowExplanation(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    } else {
      // If wrong, immediately offer hint so student can rethink!
      setShowHint(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setTextAnswer('');
      setIsSubmitted(false);
      setIsCorrect(null);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      // Finish quiz
      setIsQuizComplete(true);
      onRewardXP(earnedXP, true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
  };

  const handleRetryCurrent = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedOption('');
    setTextAnswer('');
  };

  if (!currentQ && !isQuizComplete) {
    return null;
  }

  const title = island?.title || milestone?.title || 'Thử Thách Đấu Trường';
  const subtitle =
    island?.subtitle ||
    (milestone ? `Năm ${milestone.year} • ${milestone.heroName}` : 'Kiểm tra kiến thức');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
              {island?.icon || (milestone ? '⏳' : '🎯')}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">{title}</h3>
              <p className="text-xs text-amber-100 font-medium">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>+{earnedXP} XP</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* COMPLETE SCREEN */}
          {isQuizComplete ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center shadow-xl animate-bounce">
                <Trophy className="w-10 h-10 text-amber-950" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  Thử thách hoàn tất
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Xuất Sắc! Bạn Đã Hoàn Thành!
                </h4>
                <p className="text-slate-600 text-sm mt-1">
                  Đúng {score}/{questions.length} câu • Nhận được{' '}
                  <span className="font-extrabold text-amber-600">+{earnedXP} XP</span>
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <Mascot mood="celebrate" size="sm" showSpeechBubble={false} />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Thành tích thám hiểm mới:</span>
                </div>
                <p className="text-slate-700">
                  Bạn đã ghi tên vào bảng vinh danh hôm nay! Tiếp tục khám phá các hòn đảo và mốc lịch sử tiếp theo để leo Top 1 Bảng Xếp Hạng Tuần.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-extrabold text-sm shadow-lg hover:scale-103 transition-all cursor-pointer"
                >
                  🚀 Tiếp tục khám phá
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Question Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>
                    Câu {currentIndex + 1} / {questions.length}
                  </span>
                  <span className="text-amber-600 font-extrabold">
                    +{currentQ.xp} XP
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 shadow-xs">
                <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 mb-2 border border-amber-200">
                  {currentQ.type === 'multiple_choice' && 'Trắc nghiệm (4 lựa chọn)'}
                  {currentQ.type === 'true_false' && 'Đúng hay Sai'}
                  {currentQ.type === 'fill_blank' && 'Điền vào chỗ trống'}
                  {currentQ.type === 'short_answer' && 'Trả lời ngắn'}
                </div>
                <h4 className="text-base sm:text-lg font-bold leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Mascot Reaction Mini */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <div className="w-14 h-14 shrink-0">
                  <Mascot mood={getMascotMood()} size="sm" showSpeechBubble={false} />
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-amber-800 block">
                    HIGEO Đồng Hành:
                  </span>
                  {isSubmitted ? (
                    isCorrect ? (
                      <span className="text-emerald-700 font-bold">
                        🎉 Chuẩn bài luôn! Cậu đã nắm rất chắc kiến thức phần này.
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        👀 Gần đúng rồi nha! Cậu hãy đọc kỹ gợi ý bên dưới rồi thử lại xem nhé.
                      </span>
                    )
                  ) : (
                    <span>
                      Cậu hãy suy nghĩ kỹ trước khi chọn phương án nhé! Mỗi câu trả lời đúng sẽ giúp mở khóa đảo mới.
                    </span>
                  )}
                </div>
              </div>

              {/* INPUT AREA ACCORDING TO QUESTION TYPE */}
              <div className="space-y-3">
                {/* 1. Multiple Choice Options */}
                {currentQ.type === 'multiple_choice' && currentQ.options && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i);
                      const isSelected = selectedOption === opt;
                      const isAnswer =
                        isSubmitted &&
                        showExplanation &&
                        opt.trim().toLowerCase() ===
                          (typeof currentQ.correctAnswer === 'string'
                            ? currentQ.correctAnswer.trim().toLowerCase()
                            : '');

                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted && isCorrect === true}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            isAnswer
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAnswer
                                ? 'bg-emerald-500 text-white'
                                : isSelected
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-xs sm:text-sm">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. True / False */}
                {currentQ.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-3">
                    {['Đúng', 'Sai'].map((val) => {
                      const isSelected = selectedOption === val;
                      const isAnswer =
                        isSubmitted &&
                        showExplanation &&
                        val.toLowerCase() ===
                          String(currentQ.correctAnswer).toLowerCase();

                      return (
                        <button
                          key={val}
                          disabled={isSubmitted && isCorrect === true}
                          onClick={() => setSelectedOption(val)}
                          className={`p-4 rounded-2xl border text-center font-bold text-sm sm:text-base flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isAnswer
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                              : isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">
                            {val === 'Đúng' ? '✅' : '❌'}
                          </span>
                          <span>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. Fill in the Blank / Short Answer */}
                {(currentQ.type === 'fill_blank' ||
                  currentQ.type === 'short_answer') && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block">
                      Gõ câu trả lời của bạn:
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitted && isCorrect === true}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Nhập từ hoặc cụm từ thích hợp..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-slate-900 font-semibold text-sm transition-all"
                    />
                  </div>
                )}
              </div>

              {/* HINT ACCORDION (shown when wrong or on request) */}
              {showHint && currentQ.hint && (
                <div className="p-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-800">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>💡 Gợi ý tư duy cho bạn:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 pl-5">
                    {currentQ.hint}
                  </p>
                </div>
              )}

              {/* EXPLANATION & OFFICIAL ANSWER */}
              {showExplanation && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      ✅ Đáp án đúng: {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(', ') : currentQ.correctAnswer}
                    </span>
                  </div>
                  <div className="text-slate-700 leading-relaxed pl-5">
                    <span className="font-semibold text-emerald-900">📚 Giải thích: </span>
                    {currentQ.explanation}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isQuizComplete && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Left buttons: Hint / See Answer */}
            <div className="flex items-center gap-2">
              {!showHint && (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cần gợi ý?</span>
                </button>
              )}

              {isSubmitted && !isCorrect && !showExplanation && (
                <button
                  type="button"
                  onClick={() => setShowExplanation(true)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem giải thích</span>
                </button>
              )}
            </div>

            {/* Right button: Check / Next / Retry */}
            <div className="flex items-center gap-2">
              {isSubmitted && !isCorrect && (
                <button
                  type="button"
                  onClick={handleRetryCurrent}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thử lại câu này</span>
                </button>
              )}

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={
                    (currentQ.type === 'multiple_choice' ||
                      currentQ.type === 'true_false') &&
                    !selectedOption
                  }
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
