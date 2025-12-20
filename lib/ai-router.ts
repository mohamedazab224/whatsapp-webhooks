// lib/ai-router.ts
import { azureOpenAIAgent } from "@/lib/azure-openai-agent";
import { deepSeekAgent } from "@/lib/deepseek-agent";

export class AIRouter {
  static async getBestResponse(userId: string, message: string): Promise<string> {
    const messageLower = message.toLowerCase();
    
    // قواعد لتوجيه الأنواع المختلفة من الرسائل
    if (messageLower.includes('سعر') || messageLower.includes('تكلفة')) {
      // DeepSeek أفضل للأسعار
      return await deepSeekAgent.respondToMessage(userId, message);
    } else if (messageLower.includes('موقع') || messageLower.includes('عنوان')) {
      // Azure أفضل للمعلومات الثابتة
      return await azureOpenAIAgent.respondToMessage(userId, message);
    } else {
      // اختيار عشوائي أو حسب التوفر
      try {
        return await azureOpenAIAgent.respondToMessage(userId, message);
      } catch {
        return await deepSeekAgent.respondToMessage(userId, message);
      }
    }
  }
}
