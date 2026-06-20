
import { GoogleGenAI } from "@google/genai";

// رسائل فورية مخزنة محلياً لضمان عدم توقف التطبيق أبداً
const fallbackCorrect = [
  "أحسنت يا بطل! أنت مذهل! ✨",
  "إجابة صحيحة! يا لك من ذكي! 🌟",
  "رائع جداً! استمر في اللعب! 🎈",
  "ممتاز! أنت عبقري الأرقام! 👑"
];

const fallbackWrong = [
  "لا بأس، حاول مرة أخرى يا بطل! 💪",
  "قريب جداً! جرب ثانية 🍎",
  "أنت تتعلم بسرعة، حاول مجدداً! ✨",
  "فكر قليلاً، أنت تستطيع فعلها! 🧠"
];

// دالة لجلب رسالة عشوائية فورية
export const getImmediateFeedback = (isCorrect: boolean): string => {
  const list = isCorrect ? fallbackCorrect : fallbackWrong;
  return list[Math.floor(Math.random() * list.length)];
};

// دالة جلب التشجيع من Gemini (تعمل في الخلفية)
export const getEncouragement = async (isCorrect: boolean): Promise<string | null> => {
  try {
    // التحقق من وجود المفتاح لتجنب الأخطاء القاتلة
    if (!process.env.API_KEY) return null;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: isCorrect 
        ? "أعطني عبارة تشجيعية لطفل عمره 5 سنوات أجاب صح (3 كلمات فقط)" 
        : "أعطني عبارة تحفيزية لطفل أخطأ في الحساب (3 كلمات فقط)",
      config: { 
        temperature: 0.8,
        maxOutputTokens: 20
      }
    });

    return response.text?.trim() || null;
  } catch (error) {
    console.error("Gemini Background Error:", error);
    return null;
  }
};
