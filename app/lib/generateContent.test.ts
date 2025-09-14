import { describe, expect, it } from 'vitest'
import { generatePrompt } from './generateContent'

describe('generatePrompt', () => {
  const testCases = [
    {
      name: 'should generate the correct prompt for a given input',
      input: {
        productName: 'iPhone 13',
        condition: 'Used',
        notes: 'Slight scratch on screen, otherwise perfect condition.',
      },
      expected: `You are an expert copywriter for a recommerce marketplace. Your task is to generate a compelling, short product marketing text and suggest a product category for the following used electronic gadget.\n\nProduct Information:\n- Product Name: iPhone 13\n- Condition: Used\n- Notes: Slight scratch on screen, otherwise perfect condition.\n\nInstructions:\n1. Marketing Text: Write a brief, engaging description for a marketplace listing. Highlight the key features and condition of the item based on the notes. Keep it concise and appealing to potential buyers.\n2. Category Suggestion: Based on the product information, select the most appropriate category from the available options.`,
    },
    {
      name: 'should handle empty notes field',
      input: {
        productName: 'Samsung Galaxy S21',
        condition: 'Like New',
        notes: '',
      },
      expected: `You are an expert copywriter for a recommerce marketplace. Your task is to generate a compelling, short product marketing text and suggest a product category for the following used electronic gadget.\n\nProduct Information:\n- Product Name: Samsung Galaxy S21\n- Condition: Like New\n- Notes: \n\nInstructions:\n1. Marketing Text: Write a brief, engaging description for a marketplace listing. Highlight the key features and condition of the item based on the notes. Keep it concise and appealing to potential buyers.\n2. Category Suggestion: Based on the product information, select the most appropriate category from the available options.`,
    },
  ]

  it.each(testCases)('$name', ({ input, expected }) => {
    expect(generatePrompt(input)).toBe(expected)
  })
})
