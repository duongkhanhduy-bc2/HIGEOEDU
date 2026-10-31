/**
 * Speech Recognition and Text-to-Speech services for HIGEOEDU.
 * Designed with a clean abstraction layer for browser Web Speech API
 * with easy upgradability to cloud speech providers.
 */

// ==========================================
// 1. SPEECH-TO-TEXT (VOICE INPUT) SERVICE
// ==========================================

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult: (transcript: string) => void;
  onError: (error: { code: string; message: string }) => void;
  onEnd: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  private initRecognition(): void {
    if (!this.isSupported()) return;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'vi-VN'; // Strict Vietnamese language setting
      this.recognition.continuous = false; // Stop when student pauses speaking
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      this.recognition = null;
    }
  }

  public async startListening(callbacks: SpeechRecognitionCallbacks): Promise<void> {
    if (!this.isSupported()) {
      callbacks.onError({
        code: 'not-supported',
        message:
          'Trình duyệt này chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể nhập câu hỏi bằng bàn phím hoặc sử dụng trình duyệt Chrome/Edge nhé.',
      });
      return;
    }

    // If currently running, stop previous session first
    if (this.isListening) {
      this.stopListening();
    }

    // Re-create instance to ensure clean state and avoid browser reuse bugs
    this.initRecognition();
    if (!this.recognition) return;

    let hasReceivedResult = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      hasReceivedResult = true;
      try {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          callbacks.onResult(transcript);
        } else {
          callbacks.onError({
            code: 'no-speech',
            message: '😅 Tớ chưa nghe rõ câu hỏi. Cậu thử nói chậm và rõ hơn một chút nhé!',
          });
        }
      } catch (err) {
        callbacks.onError({
          code: 'parse-error',
          message: 'Không thể phân tích giọng nói. Cậu hãy thử lại nhé!',
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errorType = event?.error || 'unknown';

      if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
        callbacks.onError({
          code: 'permission-denied',
          message:
            '🎙️ HIGEOAI chưa được cấp quyền sử dụng microphone. Hãy cho phép microphone trong cài đặt trình duyệt để sử dụng tính năng nói nhé!',
        });
      } else if (errorType === 'no-speech') {
        if (!hasReceivedResult) {
          callbacks.onError({
            code: 'no-speech',
            message: '😅 Tớ chưa nghe rõ câu hỏi. Cậu thử nói chậm và rõ hơn một chút nhé!',
          });
        }
      } else if (errorType === 'network') {
        callbacks.onError({
          code: 'network',
          message: 'Mạng không ổn định khi nhận diện giọng nói. Cậu thử lại nhé!',
        });
      } else if (errorType !== 'aborted') {
        callbacks.onError({
          code: errorType,
          message: 'Chưa thể ghi nhận giọng nói lúc này. Cậu thử lại hoặc dùng bàn phím nhé!',
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      if (err.name === 'NotAllowedError') {
        callbacks.onError({
          code: 'permission-denied',
          message:
            '🎙️ HIGEOAI chưa được cấp quyền sử dụng microphone. Hãy cho phép microphone trong cài đặt trình duyệt để sử dụng tính năng nói nhé!',
        });
      } else {
        callbacks.onError({
          code: 'start-failed',
          message: 'Không thể kích hoạt microphone. Cậu kiểm tra lại thiết bị nhé!',
        });
      }
      callbacks.onEnd();
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        try {
          this.recognition.abort();
        } catch (_) {}
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// ==========================================
// 2. TEXT-TO-SPEECH (VOICE OUTPUT) SERVICE
// ==========================================

export interface TextToSpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (errorMessage: string) => void;
}

export class TextToSpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioPlayer: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private currentMessageId: string | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.populateVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.populateVoices();
      };
    }
  }

  private populateVoices(): void {
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch (_) {}
  }

  public isSupported(): boolean {
    return (
      (typeof window !== 'undefined' && 'speechSynthesis' in window) ||
      typeof Audio !== 'undefined'
    );
  }

  /**
   * Cleans Markdown formatting, URLs, code blocks, technical JSON
   * and prepares pure, natural Vietnamese text for speech synthesis.
   */
  public cleanMarkdownForSpeech(rawText: string): string {
    if (!rawText) return '';

    let text = rawText;

    // 1. Remove code blocks (```...```) and inline code (`...`)
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // 2. Remove markdown links [title](url) -> title
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // 3. Remove raw URLs
    text = text.replace(/https?:\/\/\S+/gi, '');

    // 4. Remove Markdown headers (#, ##, ###)
    text = text.replace(/^#{1,6}\s+/gm, '');

    // 5. Remove bold & italic markup (***text***, **text**, *text*, ___text___, __text__, _text_)
    text = text.replace(/(\*{1,3}|_{1,3})([^*_]+)\1/g, '$2');

    // 6. Convert bullet points (- item, * item, • item) to natural sentence transitions
    text = text.replace(/^[\s]*[-*•]\s+/gm, '');

    // 7. Remove markdown horizontal rules (---, ===)
    text = text.replace(/^[-=_]{3,}\s*$/gm, '');

    // 8. Remove hashtags (#Tag -> Tag)
    text = text.replace(/#([\w\u00C0-\u1EF9]+)/g, '$1');

    // 9. Remove technical tokens and symbols
    text = text.replace(/[\{\}\[\]\<\>\\]/g, ' ');

    // 10. Remove decorative emojis that could cause audio stutter
    text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1FFFF}]/gu, '');

    // 11. Normalize multiple punctuation, newlines and spaces into natural pauses
    text = text.replace(/([.!?])\s*\1+/g, '$1');
    text = text.replace(/\n+/g, '. ');
    text = text.replace(/\s{2,}/g, ' ');
    text = text.replace(/\s*\.\s*\./g, '.');

    return text.trim();
  }

  /**
   * Finds the most natural Vietnamese voice available in the browser.
   */
  private getVietnameseVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (!this.voices || this.voices.length === 0) {
      this.populateVoices();
    }
    const voices = this.voices;
    if (!voices || voices.length === 0) return null;

    // 1. Exact match for Vietnamese language tag
    const viVoice = voices.find(
      (v) =>
        v.lang === 'vi-VN' ||
        v.lang === 'vi_VN' ||
        v.lang.toLowerCase().startsWith('vi')
    );
    if (viVoice) return viVoice;

    // 2. Name-based match (e.g. "Google tiếng Việt", "Microsoft HoaiMy", "Linh", "NamMinh")
    const viNameVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('tiếng việt') ||
        v.name.toLowerCase().includes('vietnamese') ||
        v.name.toLowerCase().includes('hoaimy') ||
        v.name.toLowerCase().includes('namminh')
    );
    if (viNameVoice) return viNameVoice;

    return null;
  }

  public speak(
    rawText: string,
    messageId: string,
    callbacks?: TextToSpeechCallbacks
  ): void {
    // If currently speaking this exact message, stop it
    if (this.isSpeaking && this.currentMessageId === messageId) {
      this.stop();
      callbacks?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech or audio
    this.stop();

    const cleanedText = this.cleanMarkdownForSpeech(rawText);
    if (!cleanedText) {
      callbacks?.onError?.('Nội dung câu trả lời chưa có để đọc.');
      return;
    }

    // Strategy 1: High-fidelity native Vietnamese voice from /api/tts
    // This guarantees authentic Vietnamese pronunciation regardless of client OS voice packs
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanedText)}`;
    const audio = new Audio(ttsUrl);
    this.audioPlayer = audio;
    this.currentMessageId = messageId;
    this.isSpeaking = true;

    let hasStarted = false;

    audio.onplay = () => {
      hasStarted = true;
      callbacks?.onStart?.();
    };

    audio.onended = () => {
      this.isSpeaking = false;
      this.currentMessageId = null;
      this.audioPlayer = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = () => {
      // Fallback to client Web Speech API if /api/tts has an error or offline
      if (!hasStarted) {
        this.speakWithSpeechSynthesis(cleanedText, messageId, callbacks);
      } else {
        this.stop();
        callbacks?.onError?.('🔊 Tớ chưa thể đọc câu trả lời lúc này. Cậu thử lại nhé!');
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((_err) => {
        // Fallback to client speech synthesis if browser autoplay requires user gesture or blocked
        this.speakWithSpeechSynthesis(cleanedText, messageId, callbacks);
      });
    }
  }

  /**
   * Fallback using browser Web Speech API, strictly enforcing a Vietnamese voice.
   * Never falls back to an English voice to read Vietnamese text.
   */
  private speakWithSpeechSynthesis(
    cleanedText: string,
    messageId: string,
    callbacks?: TextToSpeechCallbacks
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.stop();
      callbacks?.onError?.('Trình duyệt chưa hỗ trợ tính năng phát âm thanh.');
      return;
    }

    const viVoice = this.getVietnameseVoice();
    // Strictly verify Vietnamese voice exists before speaking
    if (!viVoice) {
      this.stop();
      callbacks?.onError?.(
        '🔊 Thiết bị của bạn chưa có gói giọng đọc tiếng Việt (vi-VN). Hãy kiểm tra cài đặt âm thanh nhé!'
      );
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.voice = viVoice;
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentMessageId = messageId;
        this.currentUtterance = utterance;
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentMessageId = null;
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentMessageId = null;
        this.currentUtterance = null;
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          callbacks?.onError?.('🔊 Tớ chưa thể đọc câu trả lời lúc này. Cậu thử lại nhé!');
        }
        callbacks?.onEnd?.();
      };

      this.currentUtterance = utterance;
      this.currentMessageId = messageId;
      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      this.stop();
      callbacks?.onError?.('🔊 Tớ chưa thể đọc câu trả lời lúc này. Cậu thử lại nhé!');
    }
  }

  public stop(): void {
    if (this.audioPlayer) {
      try {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
      } catch (_) {}
      this.audioPlayer = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
      this.currentUtterance = null;
    }

    this.isSpeaking = false;
    this.currentMessageId = null;
  }

  public getSpeakingMessageId(): string | null {
    return this.isSpeaking ? this.currentMessageId : null;
  }
}

// Singleton instances for shared use across the application
export const speechRecognitionService = new SpeechRecognitionService();
export const textToSpeechService = new TextToSpeechService();
