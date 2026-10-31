import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize server-side Gemini client per AI Studio guidelines
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export const HIGEOAI_SYSTEM_INSTRUCTION = `
Bạn là HIGEOAI – trợ lý học tập thông minh của nền tảng HIGEOEDU.
Bạn hỗ trợ học sinh THCS học tập môn Lịch sử và Địa lí theo chương trình giáo dục phổ thông của Việt Nam.

Slogan: "Học thông minh – Hiểu thông suốt – Bước cùng AI"

Phong cách giao tiếp:
- Thân thiện, dễ hiểu, tự nhiên, gần gũi.
- Khuyến khích học sinh chủ động suy nghĩ, tìm tòi khám phá.
- Có một chút phong cách Gen Z năng động nhưng lịch sự, không sử dụng tiếng lóng quá mức.
- Không trả lời quá dài dòng nếu câu hỏi đơn giản.

Khi giải thích kiến thức:
- Ưu tiên giải thích bản chất vấn đề, nguyên nhân và ý nghĩa.
- Sử dụng ví dụ sinh động, thực tế.
- Có thể sử dụng bullet point hoặc sơ đồ tư duy ngắn để dễ nhớ.
- Dùng emoji ở mức vừa phải, sinh động.

Khi học sinh hỏi bài:
- Không chỉ đưa đáp án. Hãy giải thích tại sao.

Khi học sinh yêu cầu tạo bài tập / quiz:
- Tạo câu hỏi trước (ví dụ dạng trắc nghiệm với các phương án A, B, C, D rõ ràng).
- Khuyến khích học sinh trả lời trước, TUYỆT ĐỐI KHÔNG tự động tiết lộ đáp án ngay!
- Sau khi học sinh trả lời, hãy đánh giá đúng/sai và giải thích chi tiết, mở rộng thêm điều thú vị.

Khi học sinh trả lời sai:
- Không chê bai.
- Đưa ra GỢI Ý (💡) mang tính dẫn dắt.
- Khuyến khích học sinh thử lại.

Nếu không chắc chắn về thông tin:
- Không được tự bịa thông tin lịch sử hoặc địa lí.
- Nói rõ rằng thông tin cần được kiểm chứng thêm.

Luôn ghi nhớ mục tiêu tối thượng:
HỌC THÔNG MINH – HIỂU THÔNG SUỐT – BƯỚC CÙNG AI.
`.trim();

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Build clean, alternating contents array conforming to Gemini requirements
function buildGeminiContents(
  history: ChatMessage[],
  currentPrompt: string,
  fileContext?: string
): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Filter valid history messages
  const validHistory = (history || []).filter(
    (h) => h && h.content && typeof h.content === 'string' && h.content.trim().length > 0
  );

  // Skip leading model messages so the first turn is always from user
  let startIndex = 0;
  while (startIndex < validHistory.length && validHistory[startIndex].role === 'model') {
    startIndex++;
  }

  const sliced = validHistory.slice(startIndex, startIndex + 8);
  for (const h of sliced) {
    if (contents.length > 0 && contents[contents.length - 1].role === h.role) {
      contents[contents.length - 1].parts[0].text += `\n${h.content}`;
    } else {
      contents.push({
        role: h.role,
        parts: [{ text: h.content }],
      });
    }
  }

  let finalPrompt = currentPrompt;
  if (fileContext) {
    finalPrompt = `[Nội dung tài liệu học sinh tải lên]:\n"""\n${fileContext}\n"""\n\n[Câu hỏi của học sinh]:\n${currentPrompt}`;
  }

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += `\n\n${finalPrompt}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: finalPrompt }],
    });
  }

  return contents;
}

export async function askHigeoAI(params: {
  message: string;
  history?: ChatMessage[];
  fileContext?: string;
}): Promise<string> {
  const ai = getGeminiClient();
  const { message, history = [], fileContext } = params;

  if (!ai) {
    return getSimulatedHigeoResponse(message, history);
  }

  const contents = buildGeminiContents(history, message, fileContext);

  // Attempt 1: gemini-3.8-flash
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: HIGEOAI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    if (response.text && response.text.trim().length > 0) {
      return response.text.trim();
    }
  } catch (err: any) {
    console.warn('gemini-3.8-flash notice:', err?.message || err);
  }

  // Attempt 2: High-availability fallback to gemini-3.1-flash-lite
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction: HIGEOAI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    if (response.text && response.text.trim().length > 0) {
      return response.text.trim();
    }
  } catch (err: any) {
    console.warn('gemini-3.1-flash-lite notice:', err?.message || err);
  }

  // Attempt 3: Fallback to simulated pedagogical response if network/service is momentarily down
  return getSimulatedHigeoResponse(message, history);
}

export async function generateQuizAI(params: {
  subject: 'history' | 'geography';
  grade: string;
  topic: string;
  count?: number;
  difficulty?: 'basic' | 'medium' | 'advanced';
}) {
  const ai = getGeminiClient();
  const { subject, grade, topic, count = 5, difficulty = 'medium' } = params;
  const subjectName = subject === 'history' ? 'Lịch sử' : 'Địa lí';

  if (!ai) {
    return getFallbackQuiz(subject, topic, count);
  }

  const prompt = `
Hãy tạo ${count} câu hỏi trắc nghiệm và câu hỏi tương tác môn ${subjectName} ${grade} về chủ đề "${topic}".
Độ khó: ${difficulty}.
Đối tượng: Học sinh THCS Việt Nam.

Yêu cầu trả về DUY NHẤT một mảng JSON hợp lệ (không kèm markdown \`\`\`json, chỉ chuỗi JSON thô hoặc bắt đầu bằng [):
[
  {
    "id": "q1",
    "type": "multiple_choice",
    "question": "Nội dung câu hỏi rõ ràng, kích thích tư duy",
    "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
    "correctAnswer": "Phương án đúng chính xác",
    "hint": "Gợi ý nhẹ nhàng giúp học sinh suy luận nếu chưa biết đáp án",
    "explanation": "Giải thích chi tiết, ngắn gọn, phù hợp học sinh cấp 2",
    "xp": 50
  }
]
`.trim();

  // Try 3.8-flash first then 3.1-flash-lite
  for (const model of ['gemini-3.8-flash', 'gemini-3.1-flash-lite']) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: HIGEOAI_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text?.trim() || '[]';
      const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn(`generateQuizAI with ${model} notice:`, err);
    }
  }

  return getFallbackQuiz(subject, topic, count);
}

// Fallback intelligent responses when offline or without key
function getSimulatedHigeoResponse(message: string, history: ChatMessage[]) {
  const lower = message.toLowerCase();

  if (lower.includes('nhiệt đới gió mùa') || lower.includes('khí hậu việt nam') || lower.includes('khí hậu')) {
    return `Chào cậu! 🌦️ Để hiểu vì sao nước ta có khí hậu nhiệt đới ẩm gió mùa, cậu nhớ 3 "từ khóa vàng" này nhé:

1. **Vị trí nội chí tuyến**: Việt Nam nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, góc nhập xạ lớn quanh năm nên nhận được lượng nhiệt bức xạ dồi dào (nhiệt độ trung bình năm luôn trên 20°C).
2. **Kề biển Đông rộng lớn**: Biển Đông là nguồn dự trữ ẩm khổng lồ, biến các luồng gió qua biển thành những đợt mưa rào mát rượi, giảm bớt tính chất khô hạn so với các nước cùng vĩ độ ở Tây Á hay Bắc Phi.
3. **Hoạt động của gió mùa châu Á**: Nước ta nằm ở ngã tư giao thoa gió mùa:
   - Gió mùa mùa đông (gió mùa Đông Bắc): Lạnh khô đầu mùa, lạnh ẩm mưa phùn cuối mùa ở miền Bắc.
   - Gió mùa mùa hạ (Tây Nam & Đông Nam): Nóng ẩm, mưa nhiều trên cả nước.

💡 Muốn tớ giải thích bằng sơ đồ dễ nhớ hơn không? Hoặc cậu muốn thử làm 3 câu trắc nghiệm nhanh để nhớ bài nhé! 👀`;
  }

  if (lower.includes('bạch đằng') || lower.includes('ngô quyền') || lower.includes('trận chiến')) {
    return `Haha, trận Bạch Đằng năm 938 thì siêu kinh điển luôn! ⚔️🏴‍☠️ Hãy tưởng tượng Ngô Quyền như một "bậc thầy chiến thuật tận dụng triều dâng":

- **Chiêu bài cọc gỗ**: Ngô Quyền cho quân cắm hàng ngàn cọc gỗ vạt nhọn, bịt sắt xuống lòng sông Bạch Đằng. Khi thủy triều dâng lên, nước mênh mông che giấu toàn bộ "bẫy ngầm".
- **Kế điệu hổ ly sơn**: Tướng giặc Lưu Hoằng Tháo vừa kéo chiến thuyền lớn vào, quân ta giả thua bỏ chạy nhử địch vượt qua bãi cọc khi nước đang đỉnh điểm.
- **Cú phản công nghẹt thở**: Khi triều rút nhanh, thuyền giặc quay đầu tháo chạy thì mắc kẹt vào bãi cọc nhọn hoắt, vỡ toác hàng loạt! Lưu Hoằng Tháo đền mạng, kết thúc hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ cho non sông Việt Nam! 🇻🇳

💡 Cậu thấy chiến thuật của tiền nhân nước ta có "đỉnh của chóp" không? Cậu có muốn thử giải mã 3 câu trắc nghiệm về trận này không nào?`;
  }

  if (lower.includes('điện biên phủ') || lower.includes('sơ đồ tư duy')) {
    return `Tuyệt vời! Đây là **Sơ đồ tư duy Chiến thắng Điện Biên Phủ 1954** siêu dễ nhớ cho cậu nè:

🗺️ **TRUNG TÂM: CHIẾN THẮNG ĐIỆN BIÊN PHỦ (1954)**
├── ⏰ **Thời gian**: 56 ngày đêm (13/3/1954 - 7/5/1954)
├── 🎖️ **Chỉ huy**: Đại tướng Võ Nguyên Giáp
├── 💡 **Phương châm tác chiến**: Đổi từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc"
├── 🚲 **Hậu cần kỳ diệu**: Hàng vạn xe đạp thồ vượt đèo Pha Đin, kéo pháo bằng sức người
├── 💥 **3 đợt tiến công**:
│   ├── Đợt 1: Tiêu diệt cụm cứ điểm Him Lam, Độc Lập
│   ├── Đợt 2: Chiến đấu giằng co đồi A1, C1, siết chặt chiến hào
│   └── Đợt 3: Tổng công kích, bắt sống tướng De Castries lúc 17h30 ngày 7/5
└── 🏆 **Ý nghĩa**: "Lừng lẫy năm châu, chấn động địa cầu", buộc Pháp ký Hiệp định Giơ-ne-vơ.

💡 Cậu có muốn tớ đố 1 câu thử tài ghi nhớ về thời gian hoặc địa điểm không?`;
  }

  if (lower.includes('kiểm tra') || lower.includes('câu hỏi') || lower.includes('ôn tập') || lower.includes('đố') || lower.includes('trắc nghiệm')) {
    return `Sẵn sàng luôn! Dưới đây là câu hỏi thử thách đầu tiên dành cho cậu:

👉 **Câu 1/3:** *Gió mùa Đông Bắc khi di chuyển qua biển vào nửa sau mùa đông mang lại đặc điểm thời tiết gì đặc trưng cho vùng đồng bằng Bắc Bộ nước ta?*
A. Lạnh và khô ráo hanh hao.
B. Lạnh ẩm, có mưa phùn lất phất.
C. Nóng ẩm, mưa rào kèm dông.
D. Khô nóng do hiệu ứng phơn.

💡 **Gợi ý nhẹ**: Hãy nhớ đến không khí những ngày giáp Tết Nguyên Đán se lạnh ở miền Bắc nha!
Cậu chọn phương án nào (A, B, C hay D)? Cứ gõ câu trả lời, tớ sẽ chấm và giải thích ngay nhé! 🎯`;
  }

  if (lower.includes('tại sao') || lower.includes('vì sao') || lower.includes('như vậy')) {
    return `Câu hỏi đào sâu rất hay! 🎯 Về bản chất, nguyên nhân là do sự kết hợp giữa:
1. **Hình thái địa hình**: Đồi núi chạy dài ngăn các luồng gió ẩm hoặc gió lạnh tạo nên sự phân hóa khí hậu và cảnh quan rõ rệt giữa sườn đón gió và sườn khuất gió.
2. **Quy luật địa đới**: Càng về phía Nam, góc nhập xạ càng lớn nên lượng nhiệt tăng dần, biên độ nhiệt năm giảm đi rõ rệt.

💡 Cậu có muốn tớ đưa thêm ví dụ thực tế so sánh giữa miền Bắc và miền Nam không?`;
  }

  return `Chào cậu! 👋 HIGEOAI luôn sẵn sàng đồng hành cùng cậu khám phá các bí ẩn Lịch sử nghìn năm và Địa lí bốn phương.
Cậu muốn tớ giải thích bài học nào, tóm tắt sơ đồ tư duy, hay cùng tham gia thử thách giải mã mật mã nào hôm nay? 🚀`;
}

function getFallbackQuiz(subject: 'history' | 'geography', topic: string, count: number) {
  if (subject === 'history') {
    return [
      {
        id: 'hist-q1',
        type: 'multiple_choice',
        question: 'Ai là người lãnh đạo chiến thắng Bạch Đằng năm 938 chấm dứt hơn một nghìn năm Bắc thuộc?',
        options: ['Lý Thường Kiệt', 'Ngô Quyền', 'Trần Hưng Đạo', 'Lê Hoàn'],
        correctAnswer: 'Ngô Quyền',
        hint: 'Ông là con rể của Dương Đình Nghệ và quê ở Đường Lâm (Hà Nội ngày nay).',
        explanation: 'Ngô Quyền (897 – 944) đã lãnh đạo nhân dân đánh tan quân Nam Hán trên sông Bạch Đằng năm 938, mở ra thời kỳ độc lập tự chủ lâu dài.',
        xp: 50,
      },
      {
        id: 'hist-q2',
        type: 'true_false',
        question: 'Năm 1010, vua Lý Thái Tổ dời đô từ Hoa Lư về thành Thăng Long (Hà Nội ngày nay).',
        options: ['Đúng', 'Sai'],
        correctAnswer: 'Đúng',
        hint: 'Chiếu dời đô nổi tiếng do Lý Công Uẩn ban bố vào mùa thu năm Canh Tuất 1010.',
        explanation: 'Đúng vậy! Vua Lý Thái Tổ nhận thấy Thăng Long là chốn tụ hội trọng yếu của bốn phương đất nước, thế đất rồng cuộn hổ ngồi.',
        xp: 40,
      },
      {
        id: 'hist-q3',
        type: 'fill_blank',
        question: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm ______.',
        options: ['1954'],
        correctAnswer: '1954',
        hint: 'Năm ký kết Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh ở Đông Dương.',
        explanation: 'Ngày 7/5/1954, lá cờ "Quyết chiến Quyết thắng" của quân đội ta tung bay trên nóc hầm tướng De Castries, kết thúc thắng lợi chiến dịch Điện Biên Phủ.',
        xp: 60,
      },
    ];
  }

  return [
    {
      id: 'geo-q1',
      type: 'multiple_choice',
      question: 'Dãy núi nào được coi là ranh giới tự nhiên ngăn cản gió mùa Đông Bắc, khiến miền Nam có khí hậu cận xích đạo nóng quanh năm?',
      options: ['Dãy Hoàng Liên Sơn', 'Dãy Trường Sơn Bắc', 'Dãy Bạch Mã', 'Dãy Hoành Sơn'],
      correctAnswer: 'Dãy Bạch Mã',
      hint: 'Dãy núi này nằm ở khoảng vĩ độ 16°B, nối liền Thừa Thiên Huế và Đà Nẵng.',
      explanation: 'Dãy Bạch Mã đâm ngang ra biển đóng vai trò là bức tường thành ngăn chặn luồng gió mùa Đông Bắc di chuyển xuống phía Nam.',
      xp: 50,
    },
    {
      id: 'geo-q2',
      type: 'true_false',
      question: 'Phần lớn diện tích địa hình nước ta là đồi núi thấp (chiếm khoảng 85% diện tích lãnh thổ).',
      options: ['Đúng', 'Sai'],
      correctAnswer: 'Đúng',
      hint: 'Địa hình đồi núi chiếm 3/4 diện tích, nhưng chủ yếu là đồi núi thấp dưới 1.000m.',
      explanation: 'Địa hình Việt Nam chủ yếu là đồi núi thấp dưới 1000m (chiếm tới 85%), núi cao trên 2000m chỉ chiếm khoảng 1%.',
      xp: 40,
    },
    {
      id: 'geo-q3',
      type: 'multiple_choice',
      question: 'Hai đồng bằng châu thổ lớn và phì nhiêu nhất nước ta là:',
      options: [
        'Đồng bằng sông Hồng và Đồng bằng sông Cửu Long',
        'Đồng bằng duyên hải miền Trung và Đồng bằng sông Mã',
        'Đồng bằng sông Cửu Long và Đồng bằng Thanh Hóa',
        'Đồng bằng sông Đồng Nai và Đồng bằng sông Thu Bồn',
      ],
      correctAnswer: 'Đồng bằng sông Hồng và Đồng bằng sông Cửu Long',
      hint: 'Một đồng bằng hình tam giác châu ở phía Bắc, một đồng bằng châu thổ rộng lớn ở Tây Nam Bộ.',
      explanation: 'Đồng bằng sông Hồng (khoảng 15.000 km²) và Đồng bằng sông Cửu Long (khoảng 40.000 km²) là hai vựa lúa lớn nhất cả nước.',
      xp: 50,
    },
  ];
}
