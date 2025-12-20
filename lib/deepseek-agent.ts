// lib/deepseek-agent.ts
import axios from 'axios';

export class DeepSeekAgent {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com/v1';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[DeepSeek] API Key is not set in environment variables');
    }
  }

  /**
   * الرد على رسالة العميل باستخدام DeepSeek
   */
  async respondToMessage(userId: string, message: string): Promise<string> {
    try {
      console.log(`[DeepSeek] Processing message from ${userId}: ${message.substring(0, 100)}...`);

      // نظام الرسائل لمحادثة WhatsApp
      const systemPrompt = `أنت مساعد أعمال ذكي في تطبيق واتساب لشركة UberFix.
مهامك:
1. فهم استفسار العميل ومساعدته بحل مشكلته
2. الرد بلغة ودية واحترافية بالعربية
3. إذا كان السؤال عن خدمة إصلاح، قدم معلومات مفيدة
4. إذا كان السؤال معقداً، اقترح التواصل مع خدمة العملاء
5. الرد باختصار ووضوح (لا تزيد عن 3-4 أسطر)

تذكر: أنت تتحدث مع عميل حقيقي يريد مساعدة سريعة وفعالة.`;

      const messages = [
        {
          role: 'system' as const,
          content: systemPrompt
        },
        {
          role: 'user' as const,
          content: message
        }
      ];

      const response = await this.chatCompletion(messages, {
        max_tokens: 800,
        temperature: 0.7
      });

      console.log('[DeepSeek] Response generated successfully');
      return response;

    } catch (error: any) {
      console.error('[DeepSeek] Error generating response:', error.message);
      
      // رد افتراضي في حالة الخطأ
      return 'شكراً على رسالتك! أقوم بمعالجة طلبك حالياً. إذا كان الأمر عاجلاً، يمكنك الاتصال بفريق الدعم على الرقم: 1234567890';
    }
  }

  /**
   * اتصال مباشر بـ DeepSeek API
   */
  private async chatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: { max_tokens?: number; temperature?: number } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API Key is not configured');
    }

    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 ثانية
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * تحليل الملفات (صور، PDF، إلخ)
   */
  async analyzeFile(fileUrl: string, fileType: string, userQuestion: string = ''): Promise<string> {
    try {
      // هنا يمكنك إضافة تحليل الملفات
      // حالياً نرد ببديل بسيط
      return `تم استلام ملف ${fileType} بنجاح. أقوم بتحليله وسأعود إليك بالنتائج قريباً.`;
      
    } catch (error) {
      console.error('[DeepSeek] File analysis error:', error);
      return `تم استلام ملف ${fileType}. للأسف لا يمكن تحليل هذا النوع من الملفات حالياً.`;
    }
  }
}

// إنشاء نسخة وحيدة من الوكيل
export const deepSeekAgent = new DeepSeekAgent();
