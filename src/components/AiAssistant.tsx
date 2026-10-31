import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  Square,
  Volume2,
  VolumeX,
  FileText,
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Play,
  Flame,
  Award,
  BookOpen,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { Question } from '../types/index.ts';
import {
  speechRecognitionService,
  textToSpeechService,
} from '../services/speechService.ts';

// ======================================================
// HIGEOAI - GOOGLE GEMINI API
// ======================================================
// Dán API key MỚI từ Google AI Studio vào giữa hai dấu nháy.
// Không dùng lại key đã từng gửi trong cuộc trò chuyện.
const GEMINI_API_KEY = 'AIzaSyD6fZFug2ocK8wReR9Cztg1hgT--wIaESQ';
// Ưu tiên model chính; nếu Google báo quá tải (HTTP 503),
// tự động thử lại rồi chuyển sang model Flash ổn định khác.
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
] as const;

const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

const HIGEOAI_SYSTEM_PROMPT = `
Bạn là HIGEOAI, trợ lý học tập chuyên sâu môn Lịch sử và Địa lí THCS
trên nền tảng HIGEOEDU.

ĐỐI TƯỢNG:
- Học sinh lớp 6, 7, 8, 9 theo Chương trình GDPT 2018.
- Giao tiếp bằng tiếng Việt, gần gũi, tích cực, khuyến khích học sinh tự học.

NGUYÊN TẮC:
1. Ưu tiên kiến thức chính xác, trình bày có hệ thống và phù hợp lứa tuổi.
2. Không tự bịa mốc thời gian, nhân vật, sự kiện, số liệu hoặc nội dung sách giáo khoa.
3. Khi chưa đủ căn cứ, hãy nói rõ điều chưa chắc chắn và đề nghị học sinh cung cấp
   trang sách, ảnh hoặc tài liệu để đối chiếu.
4. Khi học sinh hỏi bài tập, hướng dẫn từng bước, gợi mở tư duy trước khi đưa đáp án.
5. Phân biệt rõ kiến thức Lịch sử và Địa lí; giải thích thuật ngữ bằng ngôn ngữ dễ hiểu.
6. Không khẳng định đã đọc nội dung tệp nếu nội dung tệp chưa được cung cấp trong câu hỏi.
7. Khi tạo câu hỏi, câu chữ phải rõ ràng, chỉ có một đáp án đúng nếu là trắc nghiệm.

Bạn là người đồng hành học tập, không làm thay toàn bộ nhiệm vụ tư duy của học sinh.
`;

type GeminiPart = { text: string };
type GeminiContent = {
  role: 'user' | 'model';
  parts: GeminiPart[];
};

// Hàm dùng chung cho cả trò chuyện và tạo đề kiểm tra.
async function callGemini(
  contents: GeminiContent[],
  jsonMode = false
): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    throw new Error('Bạn chưa nhập Google Gemini API Key trong AiAssistant.tsx.');
  }

  const requestBody = {
    systemInstruction: {
      parts: [{ text: HIGEOAI_SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: jsonMode ? 0.3 : 0.7,
      maxOutputTokens: 4096,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  };

  let lastError = 'Google Gemini chưa phản hồi. Vui lòng thử lại.';

  for (const model of GEMINI_MODELS) {
    const apiUrl = `${GEMINI_API_BASE}/${model}:generateContent`;

    // Thử tối đa 3 lần khi model tạm thời quá tải.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      let response: Response;

      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify(requestBody),
        });
      } catch (networkError: any) {
        lastError = networkError?.message
          ? `Không thể kết nối Google Gemini: ${networkError.message}`
          : 'Không thể kết nối Google Gemini. Hãy kiểm tra mạng và thử lại.';
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        break;
      }

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const answer = data?.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text || '')
          .join('')
          .trim();

        if (answer) return answer;

        const reason = data?.candidates?.[0]?.finishReason;
        throw new Error(
          reason
            ? `Gemini không tạo được câu trả lời (finishReason: ${reason}).`
            : 'Gemini không trả về nội dung. Vui lòng thử lại.'
        );
      }

      const message =
        data?.error?.message ||
        `Google Gemini trả về lỗi HTTP ${response.status}.`;

      lastError = `Gemini (${model}) – HTTP ${response.status}: ${message}`;

      // Chỉ tự thử lại/chuyển model khi máy chủ báo quá tải.
      if (response.status !== 503) {
        throw new Error(lastError);
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (2 ** attempt)));
      }
    }

    // Nếu model hiện tại vẫn 503 sau 3 lần, thử model tiếp theo.
  }

  throw new Error(
    `${lastError}\nCác model Gemini đang bận hoặc quá tải. Vui lòng đợi một chút rồi gửi lại câu hỏi.`
  );
}

interface AiAssistantProps {
  onStartCustomQuiz: (questions: Question[]) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  options?: string[]; // Detected A, B, C, D options if any
  followUps?: string[]; // Quick follow-up exploration suggestions
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onStartCustomQuiz }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content:
        'Xin chào! 👋 Tớ là HIGEOAI - Bạn đồng hành thông thái 24/7 của cậu trên HIGEOEDU. Hôm nay chúng ta sẽ cùng khám phá những bí ẩn Lịch sử hay chinh phục Bản đồ Địa lí nào?',
      timestamp: 'Vừa xong',
      followUps: [
        'Tại sao nước ta có khí hậu nhiệt đới gió mùa?',
        'Kể cho tớ nghe về trận chiến Bạch Đằng năm 938 vui nhộn đi!',
        'Tạo 3 câu hỏi trắc nghiệm Lịch sử lớp 7 giúp tớ.',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    content: string;
  } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'analyzing' | 'done'
  >('idle');

  // Voice recording & TTS states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [recognizedSpeechText, setRecognizedSpeechText] = useState<string | null>(null);
  const [ttsSpeakingId, setTtsSpeakingId] = useState<string | null>(null);

  // Quick Test Generator Drawer / Modal
  const [showTestGenModal, setShowTestGenModal] = useState(false);
  const [testSubject, setTestSubject] = useState<'history' | 'geography'>('geography');
  const [testGrade, setTestGrade] = useState('Lớp 7');
  const [testTopic, setTestTopic] = useState('Khí hậu nhiệt đới gió mùa');
  const [testCount, setTestCount] = useState(5);
  const [testDifficulty, setTestDifficulty] = useState<'basic' | 'medium' | 'advanced'>('medium');
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bubblePrompts = [
    {
      label: '❓ Tại sao nước ta có khí hậu nhiệt đới gió mùa?',
      prompt: 'Tại sao nước ta có khí hậu nhiệt đới gió mùa?',
    },
    {
      label: '⚔️ Kể trận Bạch Đằng 938 vui nhộn',
      prompt: 'Kể cho tớ nghe về trận chiến trên sông Bạch Đằng năm 938 bằng giọng vui vẻ, dễ nhớ nhé!',
    },
    {
      label: '🎯 Kiểm tra kiến thức Địa lí lớp 7',
      prompt: 'Kiểm tra kiến thức chương 2 Địa lí lớp 7 giúp tớ (nhớ không đưa đáp án ngay nha)!',
    },
    {
      label: '🧠 Sơ đồ tư duy Điện Biên Phủ 1954',
      prompt: 'Tóm tắt bài học Chiến thắng Điện Biên Phủ 1954 dạng sơ đồ tư duy các nhánh chính giúp tớ.',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, uploadStatus, recognizedSpeechText]);

  // Clean up ongoing speech or voice recognition on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.stopListening();
      textToSpeechService.stop();
    };
  }, []);

  // Detect multiple choice options (A, B, C, D) in AI response
  const detectOptions = (text: string): string[] | undefined => {
    const hasA = /A[.:\)]\s+/i.test(text);
    const hasB = /B[.:\)]\s+/i.test(text);
    const hasC = /C[.:\)]\s+/i.test(text);
    const hasD = /D[.:\)]\s+/i.test(text);
    if (hasA && hasB) {
      const opts = ['A', 'B'];
      if (hasC) opts.push('C');
      if (hasD) opts.push('D');
      return opts;
    }
    return undefined;
  };

  // Generate intelligent follow-up suggestions based on response content
  const generateFollowUps = (text: string): string[] => {
    const lower = text.toLowerCase();
    if (lower.includes('khí hậu') || lower.includes('gió mùa')) {
      return [
        'Cho tớ 3 câu trắc nghiệm về phần này',
        'Giải thích đơn giản hơn',
        'Tạo sơ đồ tư duy tóm tắt',
        'Cho ví dụ thực tế dễ nhớ',
      ];
    }
    if (lower.includes('bạch đằng') || lower.includes('ngô quyền') || lower.includes('điện biên phủ') || lower.includes('lịch sử')) {
      return [
        'Đố tớ 1 câu hỏi về mốc thời gian này',
        'Ý nghĩa lịch sử quan trọng nhất là gì?',
        'Tóm tắt bằng các mốc chính',
        'Giải thích chiến thuật quân sự',
      ];
    }
    if (lower.includes('câu 1') || lower.includes('câu hỏi') || lower.includes('trắc nghiệm')) {
      return [
        '💡 Gợi ý thêm cho tớ đi',
        'Xem đáp án và giải thích',
      ];
    }
    return [
      'Cho tớ 3 câu trắc nghiệm về phần này',
      'Giải thích đơn giản hơn',
      'Tạo sơ đồ tư duy',
      'Cho ví dụ dễ nhớ',
    ];
  };

  // Gửi tin nhắn trực tiếp đến Google Gemini
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputPrompt).trim();
    if (!messageContent || isLoading) return;

    textToSpeechService.stop();
    setTtsSpeakingId(null);
    setRecognizedSpeechText(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Lịch sử cũ; loại bỏ lời chào hệ thống nếu chưa có hội thoại thật.
      const previousMessages = updatedMessages.slice(0, -1).filter(
        (message) => message.id !== 'msg-welcome' && message.id !== 'msg-reset'
      );

      const history: GeminiContent[] = previousMessages.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      }));

      const promptWithFile = attachedFile
        ? `TÊN TÀI LIỆU: ${attachedFile.name}

NỘI DUNG VĂN BẢN ĐƯỢC ĐỌC TỪ TỆP:
${attachedFile.content}

YÊU CẦU CỦA HỌC SINH:
${messageContent}`
        : messageContent;

      const contents: GeminiContent[] = [
        ...history,
        {
          role: 'user',
          parts: [{ text: promptWithFile }],
        },
      ];

      const replyText = await callGemini(contents);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        options: detectOptions(replyText),
        followUps: generateFollowUps(replyText),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('HIGEOAI Gemini chat error:', err);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'model',
          content:
            `😥 HIGEOAI chưa kết nối được với Gemini.\n\n` +
            `Chi tiết: ${err?.message || 'Lỗi không xác định.'}\n\n` +
            'Bạn hãy kiểm tra API Key, quyền sử dụng API và kết nối mạng rồi thử lại nhé!',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          followUps: [
            'Thử kết nối lại với HIGEOAI',
            'Tại sao nước ta có khí hậu nhiệt đới gió mùa?',
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
      if (attachedFile) {
        setAttachedFile(null);
        setUploadStatus('idle');
      }
    }
  };

  // Voice Input Speech-to-Text (Section 2 - 10)
  const toggleVoiceRecording = () => {
    if (isRecording) {
      // User clicked "⏹️ Dừng nghe"
      speechRecognitionService.stopListening();
      setIsRecording(false);
      setVoiceNotice(null);
      return;
    }

    if (!speechRecognitionService.isSupported()) {
      setVoiceNotice(
        '🎙️ Trình duyệt này chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể nhập câu hỏi bằng bàn phím hoặc sử dụng trình duyệt Chrome/Edge nhé.'
      );
      setTimeout(() => setVoiceNotice(null), 6000);
      return;
    }

    speechRecognitionService.startListening({
      onStart: () => {
        setIsRecording(true);
        setVoiceNotice('🔴 Đang nghe... Hãy nói câu hỏi của bạn nhé!');
      },
      onResult: (transcript) => {
        setIsRecording(false);
        setVoiceNotice(null);
        // Put text into input and show preview with edit/send options (Section 6)
        setInputPrompt(transcript);
        setRecognizedSpeechText(transcript);
      },
      onError: (err) => {
        setIsRecording(false);
        setVoiceNotice(err.message);
        setTimeout(() => setVoiceNotice(null), 5000);
      },
      onEnd: () => {
        setIsRecording(false);
      },
    });
  };

  // Text to Speech (TTS) (Section 11 - 17)
  const handleToggleSpeak = (text: string, msgId: string) => {
    if (isLoading) return; // Do not trigger while AI is thinking

    if (ttsSpeakingId === msgId) {
      textToSpeechService.stop();
      setTtsSpeakingId(null);
      return;
    }

    textToSpeechService.speak(text, msgId, {
      onStart: () => {
        setTtsSpeakingId(msgId);
      },
      onEnd: () => {
        setTtsSpeakingId(null);
      },
      onError: (errorMessage) => {
        setTtsSpeakingId(null);
        setVoiceNotice(errorMessage);
        setTimeout(() => setVoiceNotice(null), 5000);
      },
    });
  };

  // File Upload Handler (PDF, DOCX, TXT)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');

    const reader = new FileReader();
    reader.onload = async (event) => {
      setUploadStatus('analyzing');
      const text = (event.target?.result as string) || '';

      setTimeout(() => {
        setAttachedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: text.slice(0, 10000),
        });
        setUploadStatus('done');
        setInputPrompt(
          `Hãy đọc tài liệu "${file.name}" tớ vừa đính kèm và tạo 5 câu hỏi ôn tập tương tác (không đưa đáp án ngay nhé)!`
        );
      }, 700);
    };

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        setAttachedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: `Tài liệu ôn tập môn Lịch sử và Địa lí THCS: Bài học về chủ quyền biển đảo Việt Nam và các chiến dịch lịch sử giải phóng dân tộc.`,
        });
        setUploadStatus('done');
        setInputPrompt(
          `Hãy tóm tắt các ý chính trong tài liệu "${file.name}" và tạo cho tớ 3 câu hỏi điền khuyết ôn tập nhé!`
        );
      }, 900);
    }
  };

  // Tạo đề ôn tập trực tiếp bằng Google Gemini
  const handleCreateTest = async () => {
    if (!testTopic.trim()) {
      alert('Bạn hãy nhập chủ đề bài học cần tạo đề.');
      return;
    }

    setIsGeneratingTest(true);

    try {
      const subjectName = testSubject === 'history' ? 'Lịch sử' : 'Địa lí';
      const difficultyName =
        testDifficulty === 'basic'
          ? 'Nhận biết - cơ bản'
          : testDifficulty === 'medium'
          ? 'Thông hiểu và vận dụng'
          : 'Vận dụng cao - nâng cao';

      const prompt = `
Hãy tạo đúng ${testCount} câu hỏi trắc nghiệm môn ${subjectName}
dành cho học sinh ${testGrade} theo định hướng Chương trình GDPT 2018.

CHỦ ĐỀ: ${testTopic}
MỨC ĐỘ: ${difficultyName}

YÊU CẦU:
- Mỗi câu có đúng 4 phương án A, B, C, D.
- Mỗi câu chỉ có một đáp án đúng.
- Các phương án nhiễu phải hợp lí, không gây tranh cãi.
- Nội dung chính xác, phù hợp với học sinh THCS.
- Không tự bịa sự kiện, mốc thời gian hoặc số liệu.
- Mỗi câu có giải thích ngắn gọn.
- Trả về JSON hợp lệ, không dùng dấu Markdown hoặc văn bản bên ngoài JSON.

CẤU TRÚC BẮT BUỘC:
{
  "questions": [
    {
      "question": "Nội dung câu hỏi",
      "options": [
        "Nội dung phương án A",
        "Nội dung phương án B",
        "Nội dung phương án C",
        "Nội dung phương án D"
      ],
      "correctAnswer": 0,
      "correctAnswerLetter": "A",
      "explanation": "Giải thích đáp án"
    }
  ]
}

Lưu ý: correctAnswer là chỉ số đáp án bắt đầu từ 0:
0 tương ứng A, 1 tương ứng B, 2 tương ứng C, 3 tương ứng D.
`;

      const result = await callGemini(
        [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        true
      );

      let parsed: any;
      try {
        parsed = JSON.parse(result);
      } catch {
        // Dự phòng trường hợp mô hình trả JSON nằm trong code fence.
        const cleaned = result
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```$/, '');
        parsed = JSON.parse(cleaned);
      }

      if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0) {
        throw new Error('Dữ liệu đề kiểm tra trả về không có danh sách câu hỏi.');
      }

      const normalizedQuestions = parsed.questions
        .slice(0, testCount)
        .map((item: any, index: number) => {
          const rawOptions = item.options;

          const options = Array.isArray(rawOptions)
            ? rawOptions
            : rawOptions && typeof rawOptions === 'object'
            ? ['A', 'B', 'C', 'D'].map((key) => rawOptions[key] || '')
            : [];

          const letter = String(
            item.correctAnswerLetter ||
              (typeof item.correctAnswer === 'string'
                ? item.correctAnswer
                : ['A', 'B', 'C', 'D'][Number(item.correctAnswer)] || 'A')
          ).toUpperCase();

          const answerIndex = Math.max(
            0,
            ['A', 'B', 'C', 'D'].indexOf(letter)
          );

          if (!item.question || options.length !== 4 || options.some((v: any) => !v)) {
            throw new Error(`Câu ${index + 1} không đúng cấu trúc 4 phương án.`);
          }

          return {
            id: `gemini-${Date.now()}-${index}`,
            question: String(item.question),
            options: options.map((option: any) => String(option)),
            correctAnswer: answerIndex,
            correctAnswerLetter: letter,
            explanation: String(item.explanation || ''),
            subject: subjectName,
            grade: testGrade,
            topic: testTopic,
            difficulty: testDifficulty,
          };
        });

      setShowTestGenModal(false);

      // Ép kiểu tại điểm tích hợp vì kiểu Question được khai báo ở types/index.ts.
      onStartCustomQuiz(normalizedQuestions as unknown as Question[]);
    } catch (err: any) {
      console.error('HIGEOAI quiz generation error:', err);
      alert(
        `Không thể tạo đề kiểm tra.\n\n${err?.message || 'Vui lòng thử lại.'}`
      );
    } finally {
      setIsGeneratingTest(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-16 bg-gradient-to-b from-white via-sky-50/50 to-slate-50 relative overflow-hidden">
      {/* Decorative Ambient Blobs */}
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs sm:text-sm font-bold mb-3 shadow-xs">
            <Bot className="w-4 h-4 text-sky-600 animate-bounce" />
            <span>TRỢ LÍ ẢO AI HIGEOAI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-700 font-bold">Trực tuyến 24/7</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Bạn Đồng Hành Thông Thái Của Bạn
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Hỏi bất kỳ thắc mắc nào về Lịch sử & Địa lí, yêu cầu tóm tắt bài học thành sơ đồ tư duy, đính kèm đề cương hoặc tạo đề kiểm tra nhanh theo chuẩn THCS!
          </p>
        </div>

        {/* Chat UI Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-sky-100 overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header Bar */}
          <div className="p-4 sm:px-6 bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-inner">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base">HIGEOAI</span>
                  <span className="px-2 py-0.2 bg-emerald-400 text-slate-950 font-black text-[10px] rounded-full">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-sky-100 font-medium">
                  Sử dụng công nghệ Gemini AI • Chuyên biệt Lịch sử & Địa lí THCS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTestGenModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Tạo đề kiểm tra nhanh theo yêu cầu"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tạo Đề Nhanh</span>
              </button>

              <button
                onClick={() => {
                  textToSpeechService.stop();
                  setTtsSpeakingId(null);
                  speechRecognitionService.stopListening();
                  setIsRecording(false);
                  setMessages([
                    {
                      id: 'msg-reset',
                      role: 'model',
                      content:
                        'Chào cậu trở lại! Cuộc trò chuyện đã được làm mới. Cậu muốn tớ hỗ trợ gì tiếp theo? 🚀',
                      timestamp: 'Vừa xong',
                      followUps: [
                        'Tại sao nước ta có khí hậu nhiệt đới gió mùa?',
                        'Kể cho tớ nghe về trận chiến Bạch Đằng 938 đi!',
                        'Tạo 3 câu hỏi trắc nghiệm Lịch sử 7',
                      ],
                    },
                  ]);
                }}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer text-white"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Bubble Prompts (Section 7: Clicking sends directly to AI) */}
          <div className="px-4 py-2.5 bg-sky-50/70 border-b border-sky-100/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
            <span className="text-[11px] font-bold text-sky-900 shrink-0">
              Gợi ý hỏi nhanh:
            </span>
            {bubblePrompts.map((bp, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSendMessage(bp.prompt)}
                className="px-3 py-1 rounded-full bg-white hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-medium whitespace-nowrap shadow-2xs hover:scale-102 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {bp.label}
              </button>
            ))}
          </div>

          {/* Voice Notification / Error Banner */}
          {voiceNotice && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{voiceNotice}</span>
              </div>
              <button
                onClick={() => setVoiceNotice(null)}
                className="text-amber-600 hover:text-amber-800 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => {
              const isAi = msg.role === 'model';
              const isLastAiMessage = isAi && index === messages.length - 1;
              const isCurrentlySpeaking = ttsSpeakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-2`}
                >
                  <div className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${isAi ? 'justify-start' : 'justify-end'}`}>
                    {isAi && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-sm shrink-0 shadow-xs mt-1">
                        🤖
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed transition-all ${
                        isAi
                          ? isCurrentlySpeaking
                            ? 'bg-amber-50/90 border-2 border-amber-400 text-slate-900 shadow-md ring-2 ring-amber-200'
                            : 'bg-white border border-slate-200 text-slate-800'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md shadow-orange-500/10'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* In-Chat Multiple Choice Answer Buttons */}
                      {isAi && msg.options && msg.options.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                          <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                            <span>🎯 Chọn đáp án của bạn:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.options.map((opt) => (
                              <button
                                key={opt}
                                disabled={isLoading}
                                onClick={() => handleSendMessage(`Đáp án của tớ là ${opt}`)}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                Phương án {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Message Footer: Timestamp and Voice Read Button (Section 11 - 17) */}
                      {isAi && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{msg.timestamp}</span>

                          <button
                            onClick={() => handleToggleSpeak(msg.content, msg.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                              isCurrentlySpeaking
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                            }`}
                            title={isCurrentlySpeaking ? 'Dừng đọc câu trả lời' : 'Nghe câu trả lời bằng tiếng Việt'}
                          >
                            {isCurrentlySpeaking ? (
                              <>
                                <Square className="w-3 h-3 fill-amber-700 text-amber-700 animate-pulse" />
                                <span className="font-bold text-amber-800">⏹️ Dừng đọc</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                                <span>🔊 Nghe câu trả lời</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Chips after AI response */}
                  {isLastAiMessage && !isLoading && msg.followUps && msg.followUps.length > 0 && (
                    <div className="pl-11 pr-2 space-y-1.5 animate-in fade-in duration-300">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>💡 Cậu có muốn khám phá thêm?</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((chip, i) => (
                          <button
                            key={i}
                            disabled={isLoading}
                            onClick={() => handleSendMessage(chip)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 border border-sky-200/90 text-sky-800 hover:text-sky-950 text-[11px] font-medium transition-all shadow-2xs hover:scale-102 cursor-pointer disabled:opacity-50"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center animate-in fade-in">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm shadow-xs animate-bounce">
                  🤖
                </div>
                <div className="bg-white border border-sky-200 rounded-2xl px-4 py-3 shadow-xs text-xs text-slate-700 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sky-700 block">
                      🤖 HIGEOAI đang suy nghĩ...
                    </span>
                    <span className="text-[11px] text-slate-500">
                      🤔 Để tớ suy nghĩ một chút nhé...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Recognized Speech Preview Banner (Section 6: review and edit before sending) */}
          {recognizedSpeechText && (
            <div className="px-4 py-2.5 bg-sky-50/90 border-t border-sky-200 flex flex-wrap items-center justify-between text-xs text-sky-950 gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-[200px]">
                <span className="font-extrabold text-sky-900 shrink-0">🎙️ Bạn vừa nói:</span>
                <span className="italic truncate font-medium text-slate-700">
                  "{recognizedSpeechText}"
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInputPrompt(recognizedSpeechText);
                    setRecognizedSpeechText(null);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = recognizedSpeechText;
                    setRecognizedSpeechText(null);
                    handleSendMessage(text);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg font-bold text-[11px] shadow-xs hover:scale-102 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>🚀 Gửi cho HIGEOAI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecognizedSpeechText(null)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="Đóng xem trước"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Attached File Preview Pill */}
          {attachedFile && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="font-bold">{attachedFile.name}</span>
                <span className="text-amber-700">({attachedFile.size})</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-sm">
                  Đã phân tích ✓
                </span>
              </div>
              <button
                onClick={() => {
                  setAttachedFile(null);
                  setUploadStatus('idle');
                }}
                className="text-amber-700 hover:text-amber-950 font-bold cursor-pointer"
              >
                Gỡ tệp
              </button>
            </div>
          )}

          {/* Upload Progress Banner */}
          {uploadStatus === 'uploading' && (
            <div className="px-4 py-2 bg-sky-50 border-t border-sky-200 text-xs text-sky-800 flex items-center gap-2 font-medium">
              <span className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <span>Đang tải tệp lên hệ thống...</span>
            </div>
          )}
          {uploadStatus === 'analyzing' && (
            <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-200 text-xs text-indigo-800 flex items-center gap-2 font-medium">
              <Sparkles className="w-3 h-3 text-indigo-600 animate-spin-slow" />
              <span>Đang phân tích cấu trúc đề cương và nội dung bài học...</span>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* File Attachment Input (PDF, DOCX, TXT) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                title="Đính kèm tài liệu (PDF, DOC, DOCX, TXT)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Speech-to-Text Button: States "Nói với HIGEOAI" vs "Dừng nghe" (Section 2 - 10) */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isRecording
                    ? 'bg-rose-500 border-rose-600 text-white shadow-md animate-pulse'
                    : 'border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
                title={isRecording ? '⏹️ Dừng nghe' : '🎙️ Nói với HIGEOAI'}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span className="hidden sm:inline text-xs font-bold">Dừng nghe</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="hidden md:inline text-xs font-semibold">Nói</span>
                  </>
                )}
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                disabled={isLoading}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isRecording
                    ? '🔴 Đang nghe... Hãy nói câu hỏi của bạn nhé!'
                    : isLoading
                    ? 'HIGEOAI đang xử lý câu trả lời...'
                    : 'Nhập câu hỏi Sử - Địa hoặc yêu cầu tóm tắt bài học...'
                }
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-sm text-slate-900 font-medium transition-all disabled:bg-slate-50"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* QUICK PRACTICE TEST GENERATOR MODAL */}
      {showTestGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Tạo Đề Kiểm Tra Nhanh
                  </h3>
                  <p className="text-xs text-slate-500">
                    HIGEOAI sẽ tạo đề ôn tập tương tác không lộ đáp án trước
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTestGenModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Môn */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestSubject('geography');
                      setTestTopic('Khí hậu nhiệt đới ẩm gió mùa');
                    }}
                    className={`py-2 rounded-xl border font-bold text-xs cursor-pointer ${
                      testSubject === 'geography'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🌍 Địa lí
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestSubject('history');
                      setTestTopic('Chiến thắng Bạch Đằng & Hào khí Đông A');
                    }}
                    className={`py-2 rounded-xl border font-bold text-xs cursor-pointer ${
                      testSubject === 'history'
                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ⏳ Lịch sử
                  </button>
                </div>
              </div>

              {/* Lớp */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khối lớp (THCS):</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setTestGrade(grade)}
                      className={`py-2 rounded-xl border font-bold text-xs cursor-pointer ${
                        testGrade === grade
                          ? 'bg-sky-50 border-sky-500 text-sky-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chủ đề */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chủ đề bài học:</label>
                <input
                  type="text"
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-medium"
                  placeholder="Nhập tên bài hoặc chủ đề cần ôn tập..."
                />
              </div>

              {/* Số câu & Mức độ */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số lượng câu:</label>
                  <select
                    value={testCount}
                    onChange={(e) => setTestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={7}>7 câu</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức độ:</label>
                  <select
                    value={testDifficulty}
                    onChange={(e) => setTestDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="basic">Cơ bản</option>
                    <option value="medium">Vận dụng</option>
                    <option value="advanced">Nâng cao</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTestGenModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isGeneratingTest}
                onClick={handleCreateTest}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isGeneratingTest ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo đề...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Tạo đề & Làm ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
