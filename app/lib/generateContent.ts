import { GoogleGenAI, Type } from '@google/genai'

// TODO: We should not expose the API key in FE. Consider using a server for this functionality.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey: apiKey })

const categories = [
  '262 - Electronics > Communications',
  '266 - Electronics > Communications > Answering Machines',
  '5275 - Electronics > Communications > Caller IDs',
  '263 - Electronics > Communications > Communication Radio Accessories',
  '2471 - Electronics > Communications > Communication Radios',
  '2106 - Electronics > Communications > Communication Radios > CB Radios',
  '4415 - Electronics > Communications > Communication Radios > Radio Scanners',
  '273 - Electronics > Communications > Communication Radios > Two-Way Radios',
  '5404 - Electronics > Communications > Intercom Accessories',
  '360 - Electronics > Communications > Intercoms',
  '268 - Electronics > Communications > Pagers',
  '270 - Electronics > Communications > Telephony',
  '4666 - Electronics > Communications > Telephony > Conference Phones',
  '271 - Electronics > Communications > Telephony > Corded Phones',
  '272 - Electronics > Communications > Telephony > Cordless Phones',
  '264 - Electronics > Communications > Telephony > Mobile Phone Accessories',
  '8111 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Camera Accessories',
  '2353 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases',
  '4550 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Charms & Straps',
  '6030 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Pre-Paid Cards & SIM Cards',
  '543515 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Pre-Paid Cards & SIM Cards > Mobile Phone Pre-Paid Cards',
  '543516 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Pre-Paid Cards & SIM Cards > SIM Cards',
  '7347 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Replacement Parts',
  '5566 - Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Stands',
  '499916 - Electronics > Communications > Telephony > Mobile Phone Accessories > SIM Card Ejection Tools',
  '267 - Electronics > Communications > Telephony > Mobile Phones',
  '543513 - Electronics > Communications > Telephony > Mobile Phones > Contract Mobile Phones',
  '543512 - Electronics > Communications > Telephony > Mobile Phones > Pre-paid Mobile Phones',
  '543514 - Electronics > Communications > Telephony > Mobile Phones > Unlocked Mobile Phones',
  '1924 - Electronics > Communications > Telephony > Satellite Phones',
  '265 - Electronics > Communications > Telephony > Telephone Accessories',
  '269 - Electronics > Communications > Telephony > Telephone Accessories > Phone Cards',
]

export interface ContentResult {
  marketingText: string
  category: string
}

export const generatePrompt = (input: { productName: string; condition: string; notes: string }) => {
  return `You are an expert copywriter for a recommerce marketplace. Your task is to generate a compelling, short product marketing text and suggest a product category for the following used electronic gadget.

Product Information:
- Product Name: ${input.productName}
- Condition: ${input.condition}
- Notes: ${input.notes}

Instructions:
1. Marketing Text: Write a brief, engaging description for a marketplace listing. Highlight the key features and condition of the item based on the notes. Keep it concise and appealing to potential buyers.
2. Category Suggestion: Based on the product information, select the most appropriate category from the available options.`
}

async function generateContent(input: { productName: string; condition: string; notes: string }) {
  // TODO: Instead of calling the API directly, we should use a server for this functionality.
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: generatePrompt(input),
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          marketingText: {
            type: Type.STRING,
          },
          category: {
            type: Type.STRING,
            enum: categories,
          },
        },
        required: ['marketingText', 'category'],
      },
    },
  })

  if (!response.text) {
    throw new Error('No response text')
  }

  return JSON.parse(response.text) as ContentResult
}

export default generateContent
