import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'

const validateContentStep = createStep({
  id: 'validate-content',
  description: 'Validates incoming text content',
  inputSchema: z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    type: z.enum(['article', 'blog', 'social']).default('article'),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    const { content, type } = inputData

    const wordCount = content.trim().split(/\s+/).length
    const isValid = wordCount >= 5 // Minimum 5 words

    if (!isValid) {
      throw new Error(`Content too short: ${wordCount} words`)
    }

    return {
      content: content.trim(),
      type,
      wordCount,
      isValid,
    }
  },
})
