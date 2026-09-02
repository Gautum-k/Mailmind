const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_gemini_api_key')) {
    throw new Error('GEMINI_API_KEY is not configured in server environment variables. Please provide a valid Gemini API key.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

/**
 * Clean plain text content by stripping excessive tags or whitespace
 */
const cleanContent = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000);
};

// 1. Summarize Email
const summarizeEmail = async ({ subject, bodyText }) => {
  const model = getGeminiModel();
  const content = cleanContent(bodyText);

  const prompt = `
You are an expert AI email assistant. Summarize the following email clearly and concisely.

Email Subject: ${subject || '(No Subject)'}
Email Content:
${content}

Format your output as valid JSON with the following structure (do not wrap in code fences):
{
  "summary": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "keyTakeaway": "Single sentence high-level summary of the main point or request",
  "estimatedReadTime": "1 min"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      summary: [text],
      keyTakeaway: subject || 'Summary generated',
      estimatedReadTime: '1 min',
    };
  }
};

// 2. Generate Reply
const generateReply = async ({ subject, bodyText, tone = 'Professional', senderName = '' }) => {
  const model = getGeminiModel();
  const content = cleanContent(bodyText);

  const prompt = `
You are an intelligent email writing assistant. Draft a response to the following email.

Email Subject: ${subject || '(No Subject)'}
Sender: ${senderName || 'Sender'}
Tone requested: ${tone} (Options: Professional, Friendly, Formal, Concise)

Original Email Content:
${content}

Instructions:
- Write a complete, well-formatted, polite reply matching the requested "${tone}" tone.
- Do NOT include subject lines in the reply text body.

Draft Reply:
`;

  const result = await model.generateContent(prompt);
  return {
    reply: result.response.text().trim(),
    tone,
  };
};

// 3. Classify Category & Priority
const classifyEmail = async ({ subject, bodyText }) => {
  const model = getGeminiModel();
  const content = cleanContent(bodyText);

  const prompt = `
Analyze the following email and classify its category and urgency priority.

Email Subject: ${subject || '(No Subject)'}
Email Content:
${content}

Return ONLY valid JSON (no markdown formatting or code fences):
{
  "category": "Primary" | "Promotions" | "Social" | "Updates",
  "priority": "High" | "Medium" | "Low",
  "reasoning": "Short 1-sentence reason for priority",
  "isSpamWarning": false
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      category: 'Primary',
      priority: 'Medium',
      reasoning: 'Standard message analysis',
      isSpamWarning: false,
    };
  }
};

// 4. Extract Action Items
const extractActions = async ({ subject, bodyText }) => {
  const model = getGeminiModel();
  const content = cleanContent(bodyText);

  const prompt = `
Extract actionable tasks, requested to-dos, or follow-up items from this email.

Email Subject: ${subject}
Email Content:
${content}

Return ONLY valid JSON array (no markdown formatting or code fences):
{
  "actionItems": [
    { "task": "Task description", "urgency": "High" | "Normal" }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return { actionItems: [] };
  }
};

// 5. Extract Dates & Deadlines
const extractDates = async ({ subject, bodyText }) => {
  const model = getGeminiModel();
  const content = cleanContent(bodyText);

  const prompt = `
Extract any specific dates, times, deadlines, or scheduled events mentioned in this email.

Email Subject: ${subject}
Email Content:
${content}

Return ONLY valid JSON (no code fences):
{
  "dates": [
    { "title": "Event/Deadline Title", "dateString": "Formatted date or time mentioned" }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return { dates: [] };
  }
};

// 6. Translate Natural Language Smart Search to Gmail Query
const translateSmartSearch = async (userPrompt) => {
  const model = getGeminiModel();

  const prompt = `
Translate the user's natural language email search query into valid Gmail API search syntax (the 'q' parameter).

Examples:
- "unread emails from boss last week" -> "is:unread from:boss newer_than:7d"
- "invoices with attachments from accounting" -> "has:attachment invoice accounting"
- "starred emails about budget" -> "is:starred budget"
- "messages from Alex" -> "from:Alex"

User Input: "${userPrompt}"

Return ONLY valid JSON (no markdown formatting or code fences):
{
  "gmailQuery": "the translated q parameter string",
  "explanation": "Brief explanation of search criteria"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    return {
      gmailQuery: userPrompt,
      explanation: 'Direct text search query',
    };
  }
};

module.exports = {
  summarizeEmail,
  generateReply,
  classifyEmail,
  extractActions,
  extractDates,
  translateSmartSearch,
};
