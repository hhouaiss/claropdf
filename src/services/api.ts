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

export async function analyzePDF(text: string): Promise<AnalysisResult> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing documents and extracting key information. Focus on the actual content of the document, not its structure or format."
        },
        {
          role: "user",
          content: `Analyze the following text from a PDF document and provide:
          1. A brief summary of the main content (max 50 words)
          2. 4-5 key insights or main points from the document, each with a title and brief explanation
          3. 3-4 important statistics or numbers mentioned in the document, if any
          4. 2-3 action items or recommendations based on the document's content

          Respond in this JSON format:
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

          Text to analyze: ${text.substring(0, 20000)}`
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
        return JSON.parse(content) as AnalysisResult;
      }
    }
    throw new Error('Unexpected API response structure');
  } catch (error: any) {
    console.error('Error details:', error);
    
    let errorMessage = 'An unexpected error occurred';
    if (error.response && error.response.status === 400) {
      errorMessage = 'Bad request: The API could not process the document. Please check the file and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Return a valid AnalysisResult structure even in case of error
    return {
      summary: { text: `Error: ${errorMessage}`, page: 0 },
      key_insights: [{ title: "Error", explanation: "An error occurred during analysis", page: 0 }],
      key_statistics: [],
      action_items: [{ text: "Please try again or contact support if the issue persists.", page: 0 }]
    };
  }
}