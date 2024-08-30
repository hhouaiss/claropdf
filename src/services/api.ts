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
  takeaways: Array<{ text: string; page: number }>;
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
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;

    console.log('Extracted JSON string:', jsonString);

    const parsed = JSON.parse(jsonString);
    
    // Validate the parsed object has the expected structure
    if (!parsed.summary || !parsed.key_insights || !parsed.key_statistics || !parsed.takeaways) {
      throw new Error('Response is missing required fields');
    }
    
    return parsed as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error);
    console.error("Raw response:", responseText);
    
    // Safely extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    throw new Error(`Failed to parse AI response: ${errorMessage}`);
  }
}

export async function analyzePDF(text: string): Promise<AnalysisResult> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing documents and extracting key information. Respond in JSON format only."
        },
        {
          role: "user",
          content: `Analyze the following text and provide:
          1. A brief summary (max 150 words)
          2. 4-6 key insights, each with a title and brief explanation
          3. 4-6 important statistics or numbers, each with a label and value
          4. 5 Takeaways from the document

          Respond ONLY with a JSON object in this exact format:
          {
            "summary": {"text": "Brief summary here", "page": 1},
            "key_insights": [
              {"title": "Insight Title", "explanation": "Brief explanation", "page": 1}
            ],
            "key_statistics": [
              {"label": "Statistic Label", "value": "Value", "page": 1}
            ],
            "takeaways": [
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

    console.log('Raw API Response:', response);

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      if (content !== null) {
        return parseAIResponse(content);
      }
    }
    throw new Error('Unexpected API response structure');
  } catch (error: any) {
    console.error('Error details:', error);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw new Error(`Error analyzing PDF: ${error.message}`);
  }
}