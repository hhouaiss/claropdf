import { Groq } from 'groq-sdk';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AnalysisResult {
  summary: { text: string; page: number };
  key_insights: Array<{ title: string; explanation: string; page: number }>;
  key_statistics: Array<{ label: string; value: string; page: number }>;
  action_items: Array<{ text: string; page: number }>;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

function parseAIResponse(responseText: string): AnalysisResult {
  let parsedResponse: Partial<AnalysisResult> = {};

  try {
    // Attempt to parse the entire response as JSON
    parsedResponse = JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse entire response as JSON. Attempting to extract JSON.");
    
    // If parsing fails, try to extract JSON from the text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error("Failed to extract and parse JSON from response.");
      }
    }
  }

  // Ensure all required properties exist with default values
  const defaultResult: AnalysisResult = {
    summary: { text: "No summary available.", page: 0 },
    key_insights: [],
    key_statistics: [],
    action_items: []
  };

  return {
    summary: parsedResponse.summary || defaultResult.summary,
    key_insights: parsedResponse.key_insights || defaultResult.key_insights,
    key_statistics: parsedResponse.key_statistics || defaultResult.key_statistics,
    action_items: parsedResponse.action_items || defaultResult.action_items
  };
}

export async function analyzePDF(text: string): Promise<AnalysisResult> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing documents and extracting key information. Respond in JSON format only."
        },
        {
          role: "user",
          content: `Analyze the following text and provide:
          1. A brief summary (max 150 words)
          2. 4-5 key insights, each with a title and brief explanation
          3. 3-4 important statistics or numbers, each with a label and value
          4. 2-3 action items or recommendations

          Respond ONLY with a JSON object in this exact format:
          {
            "summary": {"text": "Brief summary here", "page": 1},
            "key_insights": [
              {"title": "Insight Title", "explanation": "Brief explanation", "page": 1}
            ],
            "key_statistics": [
              {"label": "Statistic Label", "value": "Value", "page": 1}
            ],
            "action_items": [
              {"text": "Action item 1", "page": 1}
            ]
          }

          Text to analyze: ${text.substring(0, 30000)}`
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.5,
      max_tokens: 7000,
      top_p: 1,
      stream: false,
      stop: null
    });

    console.log('Raw API Response:', chatCompletion);

    if (chatCompletion.choices && chatCompletion.choices[0] && chatCompletion.choices[0].message) {
      const content = chatCompletion.choices[0].message.content;
      if (content !== null) {
        return parseAIResponse(content);
      }
    }
    throw new Error('Unexpected API response structure');
  } catch (error: any) {
    console.error('Error details:', error);
    return {
      summary: { text: `Error: ${error.message}`, page: 0 },
      key_insights: [],
      key_statistics: [],
      action_items: [{ text: "An error occurred. Please try again or contact support.", page: 0 }]
    };
  }
}